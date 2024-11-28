import { Roles } from "Src/types/Roles";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./Post.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    default: Roles.User,
  })
  role!: string;

  @Column()
  name!: string;

  @OneToMany(() => Post, (post) => post.owner)
  posts?: Post[];
}
