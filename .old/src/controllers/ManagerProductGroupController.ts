import { Product } from "Src/database/entities";
import { AppContext } from "Src/helpers/AppContext";
import { NotFoundError } from "Src/helpers/Errors";

import { Request, Response } from "express";
import Joi from "joi";
import { In } from "typeorm";

interface ICreateBody {
  menuId: string;
  name: string;
  products: Product["id"][];
}

interface IUpdateBody {
  name: string;
  products: Product["id"][];
}

export class ManagerProductGroupController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const [groups, count] = await this.productGroupRepository.findAndCount({
      where: {
        companyId: request.auth!.company!.id,
      },
      relations: ["products", "products.images"],
      ...request.pagination?.toQuery(),
    });

    return response.status(200).json({
      productGroups: this.ProductGroupDTO.from(groups),
      count,
      ...request.pagination?.toResponse(),
    });
  }

  private static async _show(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const productGroup = await this.productGroupRepository.findOne({
      where: {
        id: request.params.id,
        companyId: manager.company!.id,
      },
      relations: ["products", "products.images"],
    });

    if (!productGroup) throw new NotFoundError("Grupo de produto não encontrado");

    return response.status(200).json(this.ProductGroupDTO.from(productGroup));
  }

  private static async _store(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const { value: body, error } = Joi.object<ICreateBody>({
      name: Joi.string().trim().required(),
      menuId: Joi.string().trim().required(),
      products: Joi.array().items(Joi.string().trim().optional()).optional(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const menu = await this.menuRepository.findOne({
      where: {
        id: body.menuId,
        companyId: manager.company!.id,
      },
    });

    if (!menu) throw new NotFoundError("Menu não encontrado");

    const productGroup = await this.productGroupRepository.save(
      this.productGroupRepository.create({
        name: body.name,
        menuId: body.menuId,
        companyId: manager.company!.id,
      })
    );

    if (!body.products) {
      return response.status(200).json(this.ProductGroupDTO.from(productGroup));
    }

    if (body.products) {
      const products = await this.productRepository.find({
        where: {
          id: In(body.products),
        },
        relations: ["images"],
      });

      productGroup.products = products;
      await this.productGroupRepository.save(productGroup);
    }

    return response.status(201).json(this.ProductGroupDTO.from(productGroup));
  }

  private static async _update(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const { value: body, error } = Joi.object<IUpdateBody>({
      name: Joi.string().trim().optional(),
      products: Joi.array().items(Joi.string().trim().optional()).optional(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const productGroup = await this.productGroupRepository.findOne({
      where: {
        id: request.params.id,
        companyId: manager.company!.id,
      },
    });

    if (!productGroup) throw new NotFoundError("Grupo de produto não encontrado");

    const updatedProductGroup = await this.productGroupRepository.save(
      this.productGroupRepository.merge(productGroup, {
        name: body.name,
      })
    );

    if (body.products) {
      const products = await this.productRepository.find({
        where: {
          id: In(body.products),
        },
        relations: ["images"],
      });

      updatedProductGroup.products = products;
      await this.productGroupRepository.save(updatedProductGroup);
    }

    return response.status(200).json(this.ProductGroupDTO.from(updatedProductGroup));
  }

  private static async _destroy(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const productGroup = await this.productGroupRepository.findOne({
      where: {
        id: request.params.id,
        companyId: manager.company!.id,
      },
    });

    if (!productGroup) throw new NotFoundError("Grupo de produto não encontrado");

    await this.productGroupRepository.remove(productGroup);

    return response.status(204).end();
  }

  public static index = ManagerProductGroupController._index.bind(ManagerProductGroupController);
  public static show = ManagerProductGroupController._show.bind(ManagerProductGroupController);
  public static store = ManagerProductGroupController._store.bind(ManagerProductGroupController);
  public static update = ManagerProductGroupController._update.bind(ManagerProductGroupController);
  public static destroy = ManagerProductGroupController._destroy.bind(ManagerProductGroupController);
}
