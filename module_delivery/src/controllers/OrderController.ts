import { Order } from "Shared/database/entities";
import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";
import { OrderService } from "Src/services/orders/OrderService";
import { Request, Response } from "express";

export class OrderController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const [orders, count] = await this.orderRepository.findAndCount({
      where: {
        customerId: request.auth!.customer!.id,
      },
      order: {
        createdAt: "DESC",
      },
      relations: ["company", "company.logo"],
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
      },
      relations: [
        "company",
        "customer",
        "items",
        "items.product",
        "items.product.images",
        "items.products",
        "items.products.product",
        "items.products.product.images",
      ],
    });

    if (!order) throw new NotFoundError("Pedido não encontrado");

    return response.status(200).json(this.OrderDTO.from(order));
  }

  private static async _store(request: Request, response: Response) {
    const { value: body, error } = OrderService.createValidator.validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    body.customer =
      request.auth?.customer ||
      (await this.customerRepository.save(
        this.customerRepository.create({
          defaultAddress: body.address,
          defaultPaymentMethod: body.paymentMethod,
        })
      ));

    const mappedBody = await OrderService.from(body);
    // const order = await this.orderRepository.save(this.orderRepository.create(mappedBody as Partial<Order>));
    const order = await this.orderRepository.save(this.orderRepository.create(mappedBody as unknown as Partial<Order>));

    return response.status(200).json(order);
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
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
