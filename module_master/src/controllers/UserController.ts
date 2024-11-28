import { UserDTO } from "Src/dto";
import { AppContext } from "Src/helpers/AppContext";
import { NotFoundError } from "Src/helpers/Errors";
import { Request, Response } from "express";

export class UserController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const users = await this.userRepository.find();

    return response.status(200).json(UserDTO.from(users));
  }

  private static async _show(request: Request, response: Response) {
    const user = await this.userRepository.findOne({
      where: {
        id: request.params.id,
      },
      relations: ["posts"],
    });

    if (!user) throw new NotFoundError("Usuário não encontrado");

    return response.status(200).json(UserDTO.from(user));
  }

  private static async _store(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static readonly index = UserController._index.bind(AppContext);
  public static readonly show = UserController._show.bind(AppContext);
  public static readonly store = UserController._store.bind(AppContext);
  public static readonly update = UserController._update.bind(AppContext);
  public static readonly destroy = UserController._destroy.bind(AppContext);
}
