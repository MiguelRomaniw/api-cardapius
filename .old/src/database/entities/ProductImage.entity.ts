import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { File } from "./File.entity";
import { Product } from "./Product.entity";

@Entity()
export class ProductImage extends File {
  @Column()
  productId!: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    cascade: true,
    orphanedRowAction: "delete",
  })
  @JoinColumn()
  product?: Product;
}
