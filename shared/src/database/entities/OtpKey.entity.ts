import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class OtpKey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  managerId!: string;

  @Column()
  otp!: string;
}
