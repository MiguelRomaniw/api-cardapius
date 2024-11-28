import { CompanySchedule } from "Src/types/CompanySchedule";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Additional } from "./Additional.entity";
import { CompanyLogo } from "./CompanyLogo.entity";
import { Manager } from "./Manager.entity";
import { Menu } from "./Menu.entity";
import { Order } from "./Order.entity";
import { Product } from "./Product.entity";

@Entity()
export class Company {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  managerId?: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  subdomain!: string;

  @Column({ default: false, type: "boolean" })
  showDescription!: boolean;

  @Column({ type: "longtext" })
  description!: string;

  @Column()
  contactEmail!: string;

  @Column()
  contactNumber!: string;

  @Column({ default: false, type: "boolean" })
  hasDelivery!: boolean;

  @Column({ default: false, type: "boolean" })
  hasPickUp!: boolean;

  @Column()
  websiteUrl!: string;

  @Column()
  zipCode!: string;

  @Column()
  street!: string;

  @Column()
  number!: string;

  @Column()
  county!: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  // @Column("json")
  // availablePaymentMethods!: string[]

  @Column("json")
  businessHours!: CompanySchedule[];

  @OneToOne(() => Manager, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  @JoinColumn()
  owner?: Manager;

  @OneToOne(() => CompanyLogo, (logo) => logo.company, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
    eager: true,
  })
  logo!: CompanyLogo;

  @OneToMany(() => Menu, (menu) => menu.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  menus?: Menu[];

  @OneToMany(() => Product, (product) => product.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  products?: Product[];

  @OneToMany(() => Additional, (additional) => additional.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  additionals?: Additional[];

  @OneToMany(() => Order, (order) => order.company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  orders?: Order[];
}
