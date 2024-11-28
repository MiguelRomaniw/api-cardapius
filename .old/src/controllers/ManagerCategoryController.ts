import { AppContext } from "Src/helpers/AppContext";
import { NotFoundError } from "Src/helpers/Errors";

import { Request, Response } from "express";
import Joi from "joi";

interface ICreateBody {
  name: string;
}

interface IUpdateBody {
  name: string;
}

export class ManagerCategoryController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {
        companyId: request.auth!.company!.id,
      },
      relations: ["products"],
      ...request.pagination?.toQuery(),
    });

    return response.status(200).json({
      categories: this.CategoryDTO.from(categories),
      count,
      ...request.pagination?.toResponse(),
    });
  }

  private static async _show(request: Request, response: Response) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
      relations: ["products"],
    });

    if (!category) throw new NotFoundError("Categoria não encontrada");

    return response.status(200).json(this.CategoryDTO.from(category));
  }

  private static async _store(request: Request, response: Response) {
    const { value: body, error } = Joi.object<ICreateBody>({
      name: Joi.string().trim().required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const category = await this.categoryRepository.save(
      this.categoryRepository.create({
        companyId: request.auth!.company!.id,
        name: body.name,
      })
    );

    return response.status(201).json(this.CategoryDTO.from(category));
  }

  private static async _update(request: Request, response: Response) {
    const { value: body, error } = Joi.object<IUpdateBody>({
      name: Joi.string().trim().required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const category = await this.categoryRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
    });

    if (!category) throw new NotFoundError("Categoria não encontrada");

    const updatedCategory = await this.categoryRepository.save(
      this.categoryRepository.merge(category, {
        name: body.name,
      })
    );

    return response.status(200).json(this.CategoryDTO.from(updatedCategory));
  }

  private static async _destroy(request: Request, response: Response) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
    });

    if (!category) throw new NotFoundError("Categoria não encontrada");

    await this.categoryRepository.remove(category);

    return response.status(204).end();
  }

  public static index = ManagerCategoryController._index.bind(ManagerCategoryController);
  public static show = ManagerCategoryController._show.bind(ManagerCategoryController);
  public static store = ManagerCategoryController._store.bind(ManagerCategoryController);
  public static update = ManagerCategoryController._update.bind(ManagerCategoryController);
  public static destroy = ManagerCategoryController._destroy.bind(ManagerCategoryController);
}
