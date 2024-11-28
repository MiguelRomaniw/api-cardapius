import { CustomerAddress } from "Shared/types/CustomerAddress";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order.entity";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column("json")
  defaultAddress!: CustomerAddress;

  @Column()
  defaultPaymentMethod!: string;

  @OneToMany(() => Order, (orders) => orders.customer)
  orders?: Order[];
}
