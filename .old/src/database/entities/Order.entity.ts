import { CustomerAddress } from "Src/types/CustomerAddress";
import { OrderStatuses } from "Src/types/OrderStatus";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Company, Customer } from ".";
import { OrderItem } from "./OrderItem.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  customerId?: string;

  @Column()
  companyId!: string;

  @Column()
  type!: string;

  @Column()
  paymentMethod!: string;

  @Column("json")
  address!: CustomerAddress;

  @Column({
    type: "float",
  })
  deliveryCost!: number;

  @Column({
    type: "float",
    nullable: true,
  })
  price?: number;

  @Column({ default: OrderStatuses.Waiting })
  status!: string;

  @Column("text")
  details!: string;

  @CreateDateColumn()
  createdAt!: string;

  @UpdateDateColumn()
  updatedAt!: string;

  @ManyToOne(() => Company, (company) => company.orders)
  company?: Company;

  @ManyToOne(() => Customer, (customer) => customer.orders, { onUpdate: "CASCADE", onDelete: "CASCADE", orphanedRowAction: "nullify" })
  @JoinColumn()
  customer?: Customer;

  // @Column({ type: "json" })
  // orderItems!: OrderItem[];

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items?: OrderItem[];

  // @BeforeInsert()
  // @BeforeUpdate()
  // setPrice() {
  //   this.price = this.orderItems.reduce((price, orderItem) => {
  //     return price + orderItem.price!;
  //   }, 0);
  // }

  // @ManyToMany(() => Additional)
  // @JoinTable()
  // additionals?: Additional[];
}
