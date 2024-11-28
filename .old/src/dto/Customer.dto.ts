import { CustomerAddress } from "Src/types/CustomerAddress";
import { BaseDTO } from "./Base.dto";
import { OrderDTO } from "./Order.dto";
import { Customer } from "Src/database/entities";

export class CustomerDTO extends BaseDTO {
  id: string | null = null;
  name: string | null = null;
  phoneNumber: string | null = null;
  defaultAddress: CustomerAddress | null = null;
  defaultPaymentMethod: string | null = null;
  // orders: OrderDTO[] = [];

  /**
   *
   */
  constructor(entity: Customer) {
    super();

    Object.assign(this, entity);
  }

  public static from(customer: Customer | Customer[]) {
    return super._from(customer, CustomerDTO, { orders: OrderDTO });
  }
}
