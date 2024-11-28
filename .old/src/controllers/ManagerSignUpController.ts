import { ManagerDTO } from "Src/dto";
import { AppContext } from "Src/helpers/AppContext";
import { Bcrypt } from "Src/helpers/Bcrypt";
import { ConflictError } from "Src/helpers/Errors";
import { Request, Response } from "express";
import Joi from "joi";

interface ICreateBody {
  email: string;
  cpf: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export class ManagerSignUpController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _store(request: Request, response: Response) {
    const { value: body, error } = Joi.object<ICreateBody>({
      email: Joi.string().email().trim().required(),
      cpf: Joi.string().trim().required(),
      phoneNumber: Joi.string().trim().required(),
      password: Joi.string().trim().required(),
      passwordConfirmation: Joi.ref("password"),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    if (
      await this.managerRepository.exist({
        where: {
          cpf: body.cpf,
        },
      })
    ) {
      throw new ConflictError("Este cpf já está em uso");
    }

    if (
      await this.managerRepository.exist({
        where: {
          email: body.email,
        },
      })
    ) {
      throw new ConflictError("Este email já está em uso");
    }

    const manager = await this.managerRepository.save({
      ...body,
      password: Bcrypt.hash(body.password),
    });

    return response.status(201).json(ManagerDTO.from(manager));
  }

  private static async _show(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = ManagerSignUpController._index.bind(ManagerSignUpController);
  public static show = ManagerSignUpController._show.bind(ManagerSignUpController);
  public static store = ManagerSignUpController._store.bind(ManagerSignUpController);
  public static update = ManagerSignUpController._update.bind(ManagerSignUpController);
  public static destroy = ManagerSignUpController._destroy.bind(ManagerSignUpController);
}
