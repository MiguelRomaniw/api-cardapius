import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Company } from "./Company.entity";
import { File } from "./File.entity";

@Entity()
export class CompanyLogo extends File {
  @Column()
  companyId!: string;

  @OneToOne(() => Company, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn()
  company?: Company;
}
