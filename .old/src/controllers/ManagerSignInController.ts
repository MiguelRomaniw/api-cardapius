import { dataSource } from "Src/database/app-data-source";
import { AppContext } from "Src/helpers/AppContext";
import { Bcrypt } from "Src/helpers/Bcrypt";
import { NotFoundError, ConflictError } from "Src/helpers/Errors";

import { Jwt } from "Src/helpers/Jwt";
import { nodemailer } from "Src/helpers/nodemailer";
import { UserRoles } from "Src/types/UserRoles";
import { Request, Response } from "express";
import Joi from "joi";

interface ICreateBody {
  email: string;
  password: string;
}

interface IUpdateBody {
  managerId: string;
  otp: string;
}

export class ManagerSignInController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static async _show(request: Request, response: Response) {
    const manager = await this.managerRepository.findOne({
      where: {
        id: request.auth!.manager!.id,
      },
      relations: ["company", "company.logo", "company.menus"],
    });

    return response.status(200).json(this.ManagerDTO.from(manager!));
  }

  public static async _store(request: Request, response: Response) {
    const queryRunner = dataSource.createQueryRunner();

    const { value: body, error } = Joi.object<ICreateBody>({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const manager = await this.managerRepository.findOneBy({
      email: body.email,
    });

    if (!manager) throw new NotFoundError("Usuário não encontrado");

    if (!Bcrypt.compare(body.password, manager.password)) throw new ConflictError("Senha incorreta");

    await this.otpKeyRepository.delete({ managerId: manager.id });

    if (!manager.emailConfirmed) {
      await queryRunner.startTransaction();

      const otp = `${Math.floor(100_000 + Math.random() * 900_000)}`;
      const otpKey = await queryRunner.manager.save(
        this.otpKeyRepository.create({
          managerId: manager.id,
          otp: Bcrypt.hash(otp),
        })
      );

      await nodemailer.sendMail({
        to: manager.email,
        from: "api@cardapius.com",
        subject: "Verificação OTP",
        html: `<p style="font-family: monospace;">${otp}</p>`,
      });

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return response.status(200).json(otpKey);
    }

    const token = Jwt.sign({
      id: manager.id,
      role: UserRoles.Manager,
    });

    return response.status(200).json({
      token,
    });
  }

  public static async _update(request: Request, response: Response) {
    const { value: body, error } = Joi.object<IUpdateBody>({
      managerId: Joi.string().trim().required(),
      otp: Joi.string().trim().required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const otpKey = await this.otpKeyRepository.findOneBy({
      managerId: body.managerId,
    });

    if (!otpKey) throw new NotFoundError("OTP key not found");

    if (!Bcrypt.compare(body.otp, otpKey.otp)) throw new ConflictError("Código incorreto");

    await this.otpKeyRepository.delete(otpKey);

    const manager = await this.managerRepository.findOneBy({
      id: otpKey.managerId,
    });

    if (!manager) throw new NotFoundError("Usuário não encontrado");

    await this.managerRepository.update(manager.id, {
      emailConfirmed: true,
    });

    const token = Jwt.sign({
      id: manager.id,
      role: UserRoles.Manager,
    });

    return response.status(200).json({
      token,
    });
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = ManagerSignInController._index.bind(ManagerSignInController);
  public static show = ManagerSignInController._show.bind(ManagerSignInController);
  public static store = ManagerSignInController._store.bind(ManagerSignInController);
  public static update = ManagerSignInController._update.bind(ManagerSignInController);
  public static destroy = ManagerSignInController._destroy.bind(ManagerSignInController);
}
