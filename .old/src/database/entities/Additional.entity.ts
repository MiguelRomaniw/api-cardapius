import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company.entity";

@Entity()
export class Additional {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  companyId!: string;

  @Column()
  name!: string;

  @Column()
  description?: string;

  @Column({ type: "float" })
  price!: number;

  @ManyToOne(() => Company, (company) => company.additionals)
  company?: Company;
}
