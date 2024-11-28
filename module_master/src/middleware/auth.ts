import { dataSource } from "Src/database/data-source";
import { User } from "Src/database/entities";
import { UnauthorizedAccessError, ForbiddenError, InternalServerError } from "Src/helpers/Errors";
import { Jwt } from "Src/helpers/Jwt";
import { Roles, Role } from "Src/types/Roles";
import { NextFunction, Request, Response } from "express";
import { EntityTarget } from "typeorm";

type ApiAuthenticatableUsers =
  // | Master
  // | SuperAdmin
  // | Admin
  // | Manager
  // | Employee
  User;

export function auth(allowedRoles: Roles[]) {
  return async function (request: Request, response: Response, next: NextFunction) {
    const HAuthorization = request.headers["authorization"] as string;
    const QAuthorization = request.query["authorization"] as string;

    const token = HAuthorization.split(" ")[1] || QAuthorization;

    if (!token) throw new UnauthorizedAccessError();

    const data = Jwt.verify(token);

    if (!allowedRoles.includes(data.role)) throw new ForbiddenError();

    const roleMap = new Map<Role, EntityTarget<ApiAuthenticatableUsers>>([
      // [Roles.Master, Master],
      // [Roles.SuperAdmin, SuperAdmin],
      // [Roles.Admin, Admin],
      // [Roles.Manager, Manager],
      // [Roles.Employee, Employee],
      [Roles.User, User],
    ]);

    const Entity = roleMap.get(data.role);

    if (!Entity) throw new InternalServerError("Cargo não suportado. Contate os desenvolvedores.");

    const repository = dataSource.getRepository(Entity);
    const user = await repository.findOne({
      where: { id: data.id },
    });

    if (!user) throw new UnauthorizedAccessError();

    request.auth = {
      [data.role]: user,
      role: data.role!,
      token,
    };

    next();
  };
}
