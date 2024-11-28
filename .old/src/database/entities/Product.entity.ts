import { ProductStatuses } from "Src/types/ProductStatus";
import { ProductTypes } from "Src/types/ProductTypes";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AdditionalGroup } from "./AdditionalGroup.entity";
import { Category } from "./Category.entity";
import { Company } from "./Company.entity";
import { ProductImage } from "./ProductImage.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  companyId!: string;

  @Column({ default: ProductTypes.Common })
  type!: string;

  @Column()
  name!: string;

  @Column({ default: ProductStatuses.Available })
  status!: string;

  @Column({ type: "longtext" })
  description!: string;

  @Column({ type: "float" })
  price!: number;

  @OneToMany(() => Company, (company) => company.products, { onUpdate: "CASCADE", onDelete: "CASCADE", orphanedRowAction: "delete" })
  @JoinColumn()
  company!: Company;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, { orphanedRowAction: "delete" })
  images!: ProductImage[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories?: Category[];

  @OneToMany(() => AdditionalGroup, (additionalGroup) => additionalGroup.product)
  additionalGroups?: AdditionalGroup[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // @DeleteDateColumn()
  // deletedAt!: Date;
}
