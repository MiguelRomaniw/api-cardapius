import Joi from "joi";
import { Company, Customer } from "Src/database/entities";
import { AppContext } from "Src/helpers/AppContext";
import { ConflictError, NotFoundError } from "Src/helpers/Errors";
import { CustomerAddress } from "Src/types/CustomerAddress";
import { OrderTypes } from "Src/types/OrderTypes";
import { BodyOrderItem } from "./BodyOrderItem";

type CreateOrderRequestBody = {
  company: string | Company;
  customer: Customer;
  items: BodyOrderItem[];
  type: string;
  paymentMethod: string;
  address?: CustomerAddress;
  deliveryCost: number;
  price: number;
  details: string;
};

export class OrderService extends AppContext {
  private static readonly orderItemScheme = Joi.object<BodyOrderItem>({
    product: Joi.string().trim().optional(),
    products: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().trim().optional(),
          quantity: Joi.number().integer().min(1).optional().default(1),
          metadata: Joi.object({
            proportion: Joi.object({
              value: Joi.number().integer().min(1),
              parts: Joi.number().integer().min(1),
            }).required(),
          }).optional(),
          additionalGroups: Joi.array()
            .items(
              Joi.object({
                additionalGroup: Joi.string().trim().required(),
                additionals: Joi.array()
                  .items(
                    Joi.object({
                      quantity: Joi.number().integer().min(1),
                      additional: Joi.string().trim().required(),
                    }).required()
                  )
                  .required(),
                additionalId: Joi.forbidden(),
              }).optional()
            )
            .optional(),
        }).optional()
      )
      .optional(),
    quantity: Joi.number().integer().min(1).optional().default(1),
    metadata: Joi.object({
      proportion: Joi.object({
        value: Joi.number().integer().min(1),
        parts: Joi.number().integer().min(1),
      }).required(),
    }).optional(),
    additionalGroups: Joi.array()
      .items(
        Joi.object({
          additionalGroup: Joi.string().trim().required(),
          additionals: Joi.array()
            .items(
              Joi.object({
                quantity: Joi.number().integer().min(1),
                additional: Joi.string().trim().required(),
              }).required()
            )
            .required(),
        }).optional()
      )
      .optional(),
  });
  public static readonly createValidator = Joi.object<CreateOrderRequestBody>({
    company: Joi.string().trim().required(),
    customer: Joi.forbidden(),
    items: Joi.array().items(this.orderItemScheme.required()).required(),
    type: Joi.valid(...Object.values(OrderTypes)).required(),
    paymentMethod: Joi.string().trim().required(),
    address: Joi.object({
      cep: Joi.string().trim().required(),
      state: Joi.string().trim().required(),
      city: Joi.string().trim().required(),
      county: Joi.string().trim().required(),
      street: Joi.string().trim().required(),
      number: Joi.string().trim().required(),
      complement: Joi.string().trim().optional(),
    }).optional(),
    deliveryCost: Joi.number().positive().optional(),
    price: Joi.forbidden(),
    details: Joi.string().trim().optional(),
  });

  private static async _fromItem(orderItem: BodyOrderItem, company: Company) {
    const product = await this.productRepository.findOne({
      where: {
        companyId: company.id as string,
        id: orderItem.product as string,
      },
      relations: ["additionalGroups", "images"],
    });

    if (!product) throw new NotFoundError("Produto não encontrado");

    orderItem.product = product;

    if (!orderItem.additionalGroups) return;

    for await (const bodyOrderItemProductAdditionalGroup of orderItem.additionalGroups! as any[]) {
      const additionalGroup = await this.additionalGroupRepository.findOne({
        where: {
          companyId: company.id,
          id: bodyOrderItemProductAdditionalGroup.additionalGroup as string,
        },
        relations: ["additionals"],
      });

      if (!additionalGroup) throw new NotFoundError("Grupo de adicionais não encontrado");
      if (!product.additionalGroups?.some((group) => group.id === additionalGroup.id)) {
        throw new NotFoundError("Grupo de adicionais não encontrado");
      }

      bodyOrderItemProductAdditionalGroup.additionalGroup = additionalGroup;

      for await (const bodyOrderItemProductAdditionalGroupAdditional of bodyOrderItemProductAdditionalGroup.additionals as any[]) {
        const additional = await this.additionalRepository.findOne({
          where: {
            companyId: company.id,
            id: bodyOrderItemProductAdditionalGroupAdditional.additional as string,
          },
        });

        if (!additional) throw new NotFoundError("Adicional não encontrado");
        if (!additionalGroup.additionals?.some((add) => add.id === additional.id)) throw new NotFoundError("Adicional não encontrado");

        bodyOrderItemProductAdditionalGroupAdditional.additional = additional;
      }

      const totalAdditionalsQuantity = bodyOrderItemProductAdditionalGroup.additionals.reduce(
        (total: any, additional: any) => total + additional.quantity,
        0
      );

      if (totalAdditionalsQuantity < additionalGroup.minLimit || totalAdditionalsQuantity > additionalGroup.maxLimit) {
        throw new ConflictError(`Você precisa escolher de ${additionalGroup.minLimit} á ${additionalGroup.maxLimit} adicionais`);
      }
    }

    return orderItem;
  }

  public static async from(body: CreateOrderRequestBody): Promise<CreateOrderRequestBody> {
    const company = await this.companyRepository.findOne({
      where: {
        id: body.company as string,
      },
    });

    if (!company) throw new NotFoundError("Restaurante não encontrado");

    body.company = company;

    for await (const [itemIndex, bodyOrderItem] of body.items.entries()) {
      // TODO: adaptar serviço para receber apenas um produto

      if (bodyOrderItem.product) {
        const handledItem = await this._fromItem(bodyOrderItem, company);

        handledItem && (body.items[itemIndex] = handledItem);
      } else if (bodyOrderItem.products?.length) {
        for await (const [productIndex, bodyOr] of bodyOrderItem.products!.entries()) {
          const handledItem = await this._fromItem(bodyOr, company);

          handledItem && (body.items[itemIndex].products![productIndex] = handledItem);
        }
      } else throw new ConflictError("Item do pedido inválido");
    }

    body.items = body.items.map((bodyOrderItem) => new BodyOrderItem(bodyOrderItem));

    return body;
  }
}
