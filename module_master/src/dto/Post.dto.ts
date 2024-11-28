import { Post, User } from "Src/database/entities";
import { BaseDTO } from "./Base.dto";
import { UserDTO } from "./User.dto";

export class PostDTO extends BaseDTO implements Omit<Post, ""> {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  publishedAt: Date;
  createdAt: Date;
  owner: User;

  /**
   *
   */
  constructor(entity: Post) {
    super();

    this.id = entity.id;
    this.title = entity.title;
    this.content = entity.content;
    this.isPublished = entity.isPublished;
    this.publishedAt = entity.publishedAt;
    this.createdAt = entity.createdAt;
    this.owner = entity.owner;
  }

  public static from(entityOrEntities: Partial<Post> | Partial<Post>[]) {
    return super._from(entityOrEntities, PostDTO, { owner: UserDTO });
  }
}
