import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Master {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  credentials!: string;

  @Column()
  password!: string;
}
