import { dataSource } from "Shared/database/app-data-source";
import { Company } from "Shared/database/entities";
import { ConflictError } from "Shared/helpers/Errors";

import { NextFunction, Request, Response } from "express";

export const company_middleware = async (request: Request, response: Response, next: NextFunction) => {
  const queryRunner = dataSource.createQueryRunner();

  try {
    const manager = request.auth!.manager!;

    if (!manager) {
      return next();
    }

    const company = await queryRunner.manager.findOne(Company, {
      where: {
        managerId: manager.id,
      },
    });

    if (!company) throw new ConflictError("Você não possui uma empresa ainda");

    request.auth!.company = company;

    return next();
  } catch (error: any) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }
};
