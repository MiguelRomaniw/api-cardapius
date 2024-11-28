import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { v4 } from "uuid";

@Entity()
export class OtpKey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  managerId!: string;

  @Column()
  otp!: string;
}
