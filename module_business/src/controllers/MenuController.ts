import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";

import { Request, Response } from "express";
import Joi from "joi";
import { In } from "typeorm";

interface ICreateBody {
  title: string;
  type: string;
  productGroups: {
    name: string;
    products: string[];
  }[];
}

interface IUpdateBody {
  title: string;
  type: string;
  productGroups: {
    name: string;
    products: string[];
  }[];
}

export class MenuController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const [menus, count] = await this.menuRepository.findAndCount({
      where: {
        companyId: manager.company.id,
      },
      ...request.pagination?.toQuery(),
    });

    return response.status(200).json({
      menus: this.MenuDTO.from(menus),
      count,
      ...request.pagination?.toResponse(),
    });
  }

  private static async _show(request: Request, response: Response) {
    const menuId = request.params.id;
    const menu = await this.menuRepository.findOne({
      where: {
        id: menuId,
      },
      relations: [
        "productGroups",
        "productGroups.products",
        "productGroups.products.images",
        "productGroups.products.additionalGroups",
        "productGroups.products.additionalGroups.additionals",
      ],
    });

    if (!menu) throw new NotFoundError("Este cardápio não existe");

    return response.status(200).json(this.MenuDTO.from(menu));
  }

  private static async _store(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const { error, value: body } = Joi.object<ICreateBody>({
      title: Joi.string().trim().optional().default("Menu principal"),
      type: Joi.string().trim().required(),
      productGroups: Joi.array()
        .items(
          Joi.object<{ name: string; products: string[] }>({
            name: Joi.string().trim().required(),
            products: Joi.array().items(Joi.string().trim().optional()),
          }).optional()
        )
        .optional(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const company = manager.company;

    const menu = await this.menuRepository.save({
      title: body.title,
      type: body.type,
      companyId: company.id,
    });

    const productGroups = await Promise.all(
      body.productGroups.map(async (bodyGroup) => {
        const products = await this.productRepository.find({
          where: {
            id: In(bodyGroup.products),
          },
          relations: ["images"],
        });
        const group = await this.productGroupRepository.save({
          companyId: company.id,
          menuId: menu.id,
          name: bodyGroup.name,
          products: products,
        });

        return group;
      })
    );

    menu.productGroups = productGroups;
    await this.menuRepository.save(menu);

    return response.status(201).json(this.MenuDTO.from(menu));
  }

  private static async _update(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const menuId = request.params.id;
    const { error, value: body } = Joi.object<IUpdateBody>({
      title: Joi.string().trim().optional(),
      type: Joi.string().trim().optional(),
      productGroups: Joi.array()
        .items(
          Joi.object<{ name: string; products: string[] }>({
            name: Joi.string().trim().required(),
            products: Joi.array().items(Joi.string().trim().optional()),
          }).optional()
        )
        .optional(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const menu = await this.menuRepository.findOne({
      where: {
        id: menuId,
        companyId: manager.company!.id,
      },
      relations: ["productGroups"],
    });

    if (!menu) throw new NotFoundError("Este cardápio não existe");

    const updatedMenu = await this.menuRepository.save(
      this.menuRepository.merge(menu, {
        title: body.title || menu.title,
        type: body.type || menu.type,
      })
    );

    if (!body.productGroups) {
      return response.status(200).json(this.MenuDTO.from(updatedMenu));
    }

    const productGroups = await Promise.all(
      body.productGroups.map(async (bodyGroup) => {
        const products = await this.productRepository.find({
          where: {
            id: In(bodyGroup.products),
          },
          relations: ["images"],
        });
        const group = await this.productGroupRepository.save({
          companyId: manager.company.id,
          menuId: updatedMenu.id,
          name: bodyGroup.name,
          products: products,
        });

        return group;
      })
    );

    updatedMenu.productGroups = productGroups;
    await this.menuRepository.save(updatedMenu);

    return response.status(200).json(this.MenuDTO.from(updatedMenu));
  }

  private static async _destroy(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const menuId = request.params.id;

    const menu = await this.menuRepository.findOneBy({
      id: menuId,
      companyId: manager.company!.id,
    });

    if (!menu) throw new NotFoundError("Este cardápio não existe");

    await this.menuRepository.remove(menu);

    return response.status(204).end();
  }

  public static index = MenuController._index.bind(MenuController);
  public static show = MenuController._show.bind(MenuController);
  public static store = MenuController._store.bind(MenuController);
  public static update = MenuController._update.bind(MenuController);
  public static destroy = MenuController._destroy.bind(MenuController);
}
