import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";
import { OrderStatus, OrderStatuses } from "Shared/types/OrderStatus";
import { Request, Response } from "express";
import Joi from "joi";

interface IUpdateBody {
  status: OrderStatus;
}

export class OrderController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const whereClause = Object.keys(request.query).reduce((acc, key) => {
      const value = request.query[key];

      if (!["paymentMethod", "status", "type"].includes(key)) return acc;

      acc[key] = value;

      return acc;
    }, {} as any);
    const [orders, count] = await this.orderRepository.findAndCount({
      where: whereClause,
      relations: ["customer"],
      ...request.pagination?.toQuery(),
    });

    return response.status(200).json({
      orders: this.OrderDTO.from(orders),
      count,
      ...request.pagination?.toResponse(),
    });
  }

  private static async _show(request: Request, response: Response) {
    const order = await this.orderRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
      relations: ["customer"],
    });

    if (!order) throw new NotFoundError("Pedido não encontrado");

    return response.status(200).json(this.OrderDTO.from(order));
  }

  private static async _store(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _update(request: Request, response: Response) {
    const { value: body, error } = Joi.object<IUpdateBody>({
      status: Joi.string()
        .trim()
        .valid(...Object.values(OrderStatuses))
        .required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const order = await this.orderRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
      relations: ["customer", "items", "items.additionals", "items.product", "items.product.images"],
    });

    if (!order) throw new NotFoundError("Pedido não encontrado");

    const updatedOrder = await this.orderRepository.save(this.orderRepository.merge(order, body));

    return response.status(200).json(this.OrderDTO.from(updatedOrder));
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = OrderController._index.bind(OrderController);
  public static show = OrderController._show.bind(OrderController);
  public static store = OrderController._store.bind(OrderController);
  public static update = OrderController._update.bind(OrderController);
  public static destroy = OrderController._destroy.bind(OrderController);
}
