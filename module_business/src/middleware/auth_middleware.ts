import { dataSource } from "Shared/database/app-data-source";
import { Master, Manager, Customer } from "Shared/database/entities";
import { UnauthorizedAccessError, ForbiddenError, InternalServerError } from "Shared/helpers/Errors";
import { Jwt } from "Src/helpers/Jwt";
import { UserRoles } from "Shared/types/UserRoles";
import { NextFunction, Request, Response } from "express";

interface IAttributes {
  roles: UserRoles[];
  required?: boolean;
}

type User = typeof Master | typeof Manager | typeof Customer;

const EntityMap = new Map<string, User>([
  [UserRoles.Master, Master],
  [UserRoles.Manager, Manager],
  [UserRoles.Customer, Customer],
]);

export const auth_middleware = ({ roles, required = true }: IAttributes) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const authorization = request.headers.authorization as string;
      const token = authorization?.split(" ")[1];

      if (!token && required) throw new UnauthorizedAccessError();
      if (!token && !required) return next();

      const jwtPayload = Jwt.verify(token);

      console.log(jwtPayload);
      if (!roles.includes(jwtPayload.role)) throw new ForbiddenError();
      const Entity = EntityMap.get(jwtPayload.role);

      if (!Entity) throw new InternalServerError(`O cargo ${jwtPayload.role} não possui uma entidade vinculada`);

      const repository = dataSource.getRepository(Entity!);
      const user = await repository.findOne({
        where: {
          id: jwtPayload.id,
        },
      });

      console.log(user);

      if (!user && required) throw new UnauthorizedAccessError();

      request.auth = {
        role: jwtPayload.role,
        token,
        [jwtPayload.role]: user,
      };

      return next();
    } catch (error: any) {
      console.log(error);
      return response.status(error.statusCode).json(error);
    }
  };
};
