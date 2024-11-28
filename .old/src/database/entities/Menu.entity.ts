import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company.entity";
import { ProductGroup } from "./ProductGroup.entity";

@Entity()
export class Menu {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  companyId!: string;

  @Column()
  type!: string;

  @Column()
  title!: string;

  @OneToMany(() => ProductGroup, (productGroup) => productGroup.menu, { cascade: true })
  productGroups?: ProductGroup[];

  @ManyToOne(() => Company, { onUpdate: "CASCADE", onDelete: "CASCADE", orphanedRowAction: "delete" })
  @JoinColumn()
  company?: Company;
}
