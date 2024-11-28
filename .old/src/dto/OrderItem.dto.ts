import { BaseDTO } from "./Base.dto";
import { OrderItem } from "Src/database/entities";
import { OrderDTO } from "./Order.dto";
import { ProductDTO } from "./Product.dto";

export class OrderItemDTO extends BaseDTO implements Pick<OrderItem, "id" | "price" | "pricePerUnit" | "quantity"> {
  id!: string;
  // orderId!: string;
  // productId?: string | undefined;
  price!: number;
  pricePerUnit!: number;
  quantity!: number;
  order?: OrderDTO;
  product?: ProductDTO;
  products?: OrderItemDTO[] = undefined;
  metadata?: { proportion: { value: number; parts: number } };

  constructor(entity: OrderItem) {
    super();

    Object.assign(this, entity);
  }

  public static from(entityOrEntities: OrderItem | OrderItem[]) {
    return super._from(entityOrEntities, OrderItemDTO, { order: OrderDTO, product: ProductDTO, products: OrderItemDTO });
  }
}
