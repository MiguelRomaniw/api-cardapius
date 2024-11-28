import { dataSource } from "Shared/database/app-data-source";
import { AppContext } from "Shared/helpers/AppContext";
import { ConflictError, NotFoundError } from "Shared/helpers/Errors";
import { Jetpack } from "Shared/helpers/Jetpack";
import { CompanySchedule } from "Shared/types/CompanySchedule";
import { DaysOfWeek } from "Shared/types/DaysOfWeek";
import { FileTypes } from "Shared/types/FileTypes";
import { Request, Response } from "express";
import Joi from "joi";
import { v4 } from "uuid";

type ICreateBody = {
  name: string;
  subdomain: string;
  showDescription: boolean;
  description: string;
  contactEmail: string;
  contactNumber: string;
  websiteUrl: string;
  hasDelivery: boolean;
  hasPickUp: boolean;
  zipCode: string;
  street: string;
  number: string;
  county: string;
  city: string;
  state: string;
  businessHours: CompanySchedule[];
};

type IUpdateBody = Omit<ICreateBody, "">;

export class CompanyController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static async _show(request: Request, response: Response) {
    const company = await this.companyRepository.findOne({
      where: {
        id: request.auth!.manager!.companyId,
      },
      relations: ["logo", "menus", "owner", "owner.company", "owner.company.logo"],
    });

    if (!company) throw new NotFoundError("Restaurante não encontrado!");

    return response.status(200).json(this.CompanyDTO.from(company!));
  }

  public static async _store(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const { value: body, error } = Joi.object<ICreateBody>({
      name: Joi.string().trim().required(),
      subdomain: Joi.string().trim().required(),
      showDescription: Joi.boolean().optional().default(false),
      description: Joi.string().trim().optional(),
      contactEmail: Joi.string().email().required(),
      contactNumber: Joi.string().required(),
      websiteUrl: Joi.string().trim().uri().required(),
      hasDelivery: Joi.boolean().required().optional().default(false),
      hasPickUp: Joi.boolean().required().optional().default(false),
      zipCode: Joi.string().required(),
      street: Joi.string().required(),
      number: Joi.string().regex(/\d*/).required(),
      county: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      businessHours: Joi.array()
        .items(
          Joi.object<CompanySchedule>({
            day: Joi.string()
              .trim()
              .valid(...Object.values(DaysOfWeek))
              .required(),
            startAt: Joi.string()
              .regex(/^[0-9]{2}:[0-9]{2}$/)
              .trim()
              .optional()
              .default("00:00"),
            endAt: Joi.string()
              .regex(/^[0-9]{2}:[0-9]{2}$/)
              .trim()
              .optional()
              .default("00:00"),
            isOpen: Joi.boolean().optional().default(true),
          }).required()
        )
        .length(7)
        .required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    if (manager.company) throw new ConflictError("Você já tem uma empresa");

    const isSubdomainInUse = await this.companyRepository.exist({
      where: {
        subdomain: body.subdomain,
      },
    });

    if (isSubdomainInUse) throw new ConflictError("Este subdomínio já está em uso");

    const company = await this.companyRepository.save({
      ...body,
      managerId: manager.id,
    });

    const logo = request.file;

    if (logo) {
      const queryRunner = dataSource.createQueryRunner();

      await queryRunner.startTransaction();

      const extname = logo.mimetype.split("/")[1];
      const fileName = `${v4()}.${extname}`;

      await queryRunner.manager.save(
        this.companyLogoRepository.create({
          fileName,
          type: FileTypes.CompanyLogo,
          companyId: company.id,
        })
      );

      await Jetpack.upload({ data: logo.buffer, fileName: `${FileTypes.CompanyLogo}/${fileName}` });

      await queryRunner.commitTransaction();
      await queryRunner.release();
    }

    return response.status(201).json(this.CompanyDTO.from(company));
  }

  public static async _update(request: Request, response: Response) {
    const { value: body, error } = Joi.object<IUpdateBody>({
      name: Joi.string().trim().optional(),
      subdomain: Joi.string().trim().optional(),
      showDescription: Joi.boolean().optional(),
      description: Joi.string().trim().optional(),
      contactEmail: Joi.string().email().optional(),
      contactNumber: Joi.string().optional(),
      websiteUrl: Joi.string().trim().uri().optional(),
      hasDelivery: Joi.boolean().optional(),
      hasPickUp: Joi.boolean().optional(),
      zipCode: Joi.string().optional(),
      street: Joi.string().optional(),
      number: Joi.string().regex(/\d*/).optional(),
      county: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      businessHours: Joi.array()
        .items(
          Joi.object<CompanySchedule>({
            day: Joi.string()
              .trim()
              .valid(...Object.values(DaysOfWeek))
              .required(),
            startAt: Joi.string()
              .regex(/^[0-9]{2}:[0-9]{2}$/)
              .trim()
              .optional()
              .default("00:00"),
            endAt: Joi.string()
              .regex(/^[0-9]{2}:[0-9]{2}$/)
              .trim()
              .optional()
              .default("00:00"),
            isOpen: Joi.boolean().optional().default(true),
          }).optional()
        )
        .max(7)
        .optional(),
    }).validate(request.body);

    const queryRunner = dataSource.createQueryRunner();
    const manager = request.auth!.manager!;
    const company = manager.company;

    if (error) {
      return response.status(422).json(error);
    }

    const isSubdomainInUse = await this.companyRepository.exist({
      where: {
        subdomain: body.subdomain || "",
      },
    });

    if (body.subdomain && isSubdomainInUse) throw new ConflictError("Este subdomínio já está em uso");

    company.logo && (await this.companyLogoRepository.remove(company.logo));

    const updatedCompany = await this.companyRepository.save(this.companyRepository.merge(company, body));

    const logo = request.file;

    if (!logo) {
      return response.status(200).json(this.CompanyDTO.from(updatedCompany));
    }

    await queryRunner.startTransaction();

    const extname = logo.mimetype.split("/")[1];
    const fileName = company.logo?.fileName || `${v4()}.${extname}`;
    const companyLogo =
      company.logo ||
      this.companyLogoRepository.create({
        companyId: manager.company.id,
        type: FileTypes.CompanyLogo,
        fileName,
      });

    await queryRunner.manager.save(companyLogo);

    await Jetpack.upload({ data: logo.buffer, fileName: `${companyLogo.type}/${fileName}` });

    await queryRunner.commitTransaction();
    await queryRunner.release();

    return response.status(200).json(this.CompanyDTO.from(updatedCompany));
  }

  public static async _destroy(request: Request, response: Response) {
    const manager = request.auth!.manager!;

    const company = await this.companyRepository.findOne({
      where: {
        managerId: manager.id,
      },
    });

    if (!company) throw new ConflictError("Você não tem uma empresa ainda");

    await this.companyRepository.remove(company);

    return response.status(204).end();
  }

  public static index = CompanyController._index.bind(CompanyController);
  public static show = CompanyController._show.bind(CompanyController);
  public static store = CompanyController._store.bind(CompanyController);
  public static update = CompanyController._update.bind(CompanyController);
  public static destroy = CompanyController._destroy.bind(CompanyController);
}
