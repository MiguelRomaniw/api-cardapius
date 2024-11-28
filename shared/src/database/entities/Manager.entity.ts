import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Company } from "./Company.entity";

@Entity()
export class Manager {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  companyId?: string;

  @Column({ unique: true })
  cpf!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ default: false, type: "boolean" })
  emailConfirmed!: boolean;

  @Column()
  phoneNumber!: string;

  @Column()
  password!: string;

  @OneToOne(() => Company, (company) => company.owner)
  company!: Company;
}
