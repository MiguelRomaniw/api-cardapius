import { Order, Customer, Company } from "Src/database/entities";
import { CustomerAddress } from "Src/types/CustomerAddress";
import { BaseDTO } from "./Base.dto";
import { CompanyDTO } from "./Company.dto";
import { CustomerDTO } from "./Customer.dto";
import { OrderItemDTO } from "./OrderItem.dto";

export class OrderDTO extends BaseDTO implements Omit<Order, "items" | "company" | "customer"> {
  id!: string;
  companyId!: string;
  customerId!: string;
  type!: string;
  price!: number;
  deliveryCost!: number;
  paymentMethod!: string;
  address!: CustomerAddress;
  details!: string;
  status!: string;
  createdAt!: string;
  updatedAt!: string;
  company?: CompanyDTO | undefined;
  items?: OrderItemDTO[] | undefined;
  customer?: CustomerDTO | undefined;
  /**
   *
   */
  constructor(order: Order) {
    super();

    Object.assign(this, order);
  }

  public static from(order: Order | Order[]) {
    return super._from(order, OrderDTO, { company: CompanyDTO, customer: CustomerDTO, items: OrderItemDTO });
  }
}
