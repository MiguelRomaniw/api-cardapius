import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Additional } from "./Additional.entity";
import { Product } from "./Product.entity";

@Entity()
export class AdditionalGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  companyId!: string;

  @Column()
  productId!: string;

  @Column()
  name!: string;

  @Column({ default: false, type: "boolean" })
  required!: boolean;

  @Column({ default: 0, type: "int" })
  minLimit!: number;

  @Column({ default: 0, type: "int" })
  maxLimit!: number;

  @ManyToMany(() => Additional, { cascade: true })
  @JoinTable()
  additionals?: Additional[];

  @ManyToOne(() => Product, (product) => product.additionalGroups, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    orphanedRowAction: "delete",
  })
  product?: Product;
}
