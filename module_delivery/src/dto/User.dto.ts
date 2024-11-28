import { Post, User } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { PostDTO } from "./Post.dto";

export class UserDTO extends BaseDTO implements Omit<User, "role"> {
  id: string;
  name: string;
  posts?: Post[] = [];

  constructor(entity: User) {
    super();

    this.id = entity.id;
    this.name = entity.name;
    this.posts = entity.posts;
  }

  public static from(entityOrEntities: User | User[]) {
    return super._from(entityOrEntities, UserDTO, { posts: PostDTO });
  }
}
