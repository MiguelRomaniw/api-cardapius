import { AppContext } from "Src/helpers/AppContext";
import { NotFoundError } from "Src/helpers/Errors";

import { OrderStatus, OrderStatuses } from "Src/types/OrderStatus";
import { Request, Response } from "express";
import Joi from "joi";

interface IUpdateBody {
  status: OrderStatus;
}

export class ManagerOrderController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const whereClause = Object.keys(request.query).reduce(
      (acc, key) => {
        const value = request.query[key];

        if (!["paymentMethod", "status", "type"].includes(key)) return acc;

        acc[key] = value;

        return acc;
      },
      { companyId: request.auth!.company!.id } as any
    );
    const [orders, count] = await this.orderRepository.findAndCount({
      where: whereClause,
      relations: ["customer", "items", "items.additionals", "items.product", "items.product.images"],
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
      relations: ["customer", "items", "items.additionals", "items.product", "items.product.images"],
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

  public static index = ManagerOrderController._index.bind(ManagerOrderController);
  public static show = ManagerOrderController._show.bind(ManagerOrderController);
  public static store = ManagerOrderController._store.bind(ManagerOrderController);
  public static update = ManagerOrderController._update.bind(ManagerOrderController);
  public static destroy = ManagerOrderController._destroy.bind(ManagerOrderController);
}
