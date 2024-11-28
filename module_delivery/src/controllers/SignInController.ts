import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";
import { UserRoles } from "Shared/types/UserRoles";
import { Jwt } from "Src/helpers/Jwt";
import { Request, Response } from "express";
import Joi from "joi";

interface ICreateBody {
  phoneNumber: string;
}

export class SignInController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    const customer = request.auth!.customer!;

    return response.status(200).json(this.CustomerDTO.from(customer));
  }

  private static async _store(request: Request, response: Response) {
    const { value: body, error } = Joi.object<ICreateBody>({
      phoneNumber: Joi.string().trim().required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const customer = await this.customerRepository.findOne({
      where: {
        phoneNumber: body.phoneNumber,
      },
    });

    if (!customer) throw new NotFoundError("Credenciais inválidas");

    const token = Jwt.sign({
      id: customer.id,
      role: UserRoles.Customer,
    });

    return response.status(200).json({
      customer,
      token,
    });
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = SignInController._index.bind(SignInController);
  public static show = SignInController._show.bind(SignInController);
  public static store = SignInController._store.bind(SignInController);
  public static update = SignInController._update.bind(SignInController);
  public static destroy = SignInController._destroy.bind(SignInController);
}
