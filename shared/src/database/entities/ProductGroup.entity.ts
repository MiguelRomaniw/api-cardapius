import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Menu, Product } from ".";

@Entity()
export class ProductGroup {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  menuId!: string;

  @Column()
  companyId!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Menu, { onDelete: "CASCADE", onUpdate: "CASCADE", orphanedRowAction: "delete" })
  @JoinColumn()
  menu?: Menu;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable()
  products?: Product[];
}
