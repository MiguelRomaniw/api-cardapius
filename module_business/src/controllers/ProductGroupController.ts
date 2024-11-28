import { Product } from "Shared/database/entities";
import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";

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

export class ProductGroupController extends AppContext {
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

  public static index = ProductGroupController._index.bind(ProductGroupController);
  public static show = ProductGroupController._show.bind(ProductGroupController);
  public static store = ProductGroupController._store.bind(ProductGroupController);
  public static update = ProductGroupController._update.bind(ProductGroupController);
  public static destroy = ProductGroupController._destroy.bind(ProductGroupController);
}
