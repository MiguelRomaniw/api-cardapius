import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "boolean" })
  isPublished!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  publishedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE", orphanedRowAction: "delete", eager: true })
  owner!: User;
}
