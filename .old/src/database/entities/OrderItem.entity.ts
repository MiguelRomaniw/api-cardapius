import { IBodyOrderItem } from "Src/services/orders/IBodyOrderItem";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Product } from "./Product.entity";
import { Order } from "./Order.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  parentItemId!: string;

  @Column({ nullable: true })
  orderId?: string;

  @Column({ nullable: true })
  productId?: string;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ type: "float" })
  price!: number;

  @Column({ type: "float" })
  pricePerUnit!: number;

  @Column({ type: "json", nullable: true })
  metadata?: IBodyOrderItem["metadata"];

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order?: Order;

  @ManyToOne(() => Product, { orphanedRowAction: "nullify" })
  @JoinColumn()
  product?: Product;

  @ManyToOne(() => OrderItem, (item) => item.products, { eager: true })
  parentItem?: OrderItem;

  @OneToMany(() => OrderItem, (item) => item.parentItem, { onDelete: "CASCADE", cascade: true })
  @JoinColumn()
  products?: OrderItem[];
}
