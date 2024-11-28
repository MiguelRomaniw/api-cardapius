import { Request, Response } from "express";
import Joi from "joi";
import { dataSource } from "Shared/database/app-data-source";
import { Additional, AdditionalGroup, Category, Product } from "Shared/database/entities";
import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";
import { Jetpack } from "Shared/helpers/Jetpack";
import { FileTypes } from "Shared/types/FileTypes";
import { ProductStatus, ProductStatuses } from "Shared/types/ProductStatus";
import { In } from "typeorm";
import { v4 } from "uuid";

interface IAdditionalGroup {
  name: string;
  minLimit: number;
  maxLimit: number;
  required: boolean;
  additionals: string[];
}

interface ICreateBody {
  name: string;
  status: ProductStatus;
  description: string;
  price: number;
  categories: string[] | Category[];
  additionals: string[] | Additional[];
  additionalGroups: IAdditionalGroup[] | AdditionalGroup[];
}

interface IUpdateBody {
  name: string;
  status: ProductStatus;
  description: string;
  price: number;
  categories: string[] | Category[];
  additionals: string[] | Additional[];
  additionalGroups: IAdditionalGroup[] | AdditionalGroup[];
}

export class ProductController extends AppContext {
  public static async _index(request: Request, response: Response) {
    const company = request.auth!.company!;
    const [products, count] = await this.productRepository.findAndCount({
      where: {
        companyId: company.id,
      },
      order: {
        updatedAt: "DESC",
      },
      relations: ["images", "categories", "additionalGroups", "additionalGroups.additionals"],
      ...request.pagination?.toQuery(),
    });

    return response.status(200).json({
      products: this.ProductDTO.from(products),
      count: count,
      ...request.pagination?.toResponse(),
    });
  }

  private static async _show(request: Request, response: Response) {
    const company = request.auth!.company!;
    const product = await this.productRepository.findOne({
      where: { id: request.params.id, companyId: company.id },
      relations: ["images", "categories", "additionalGroups", "additionalGroups.additionals"],
    });

    if (!product) throw new NotFoundError("Product não encontrado");

    return response.status(200).json(this.ProductDTO.from(product));
  }

  private static async _store(request: Request, response: Response) {
    const queryRunner = dataSource.createQueryRunner();
    const manager = request.auth!.manager!;
    const {
      value: { additionalGroups: bodyAdditionalGroups, ...body },
      error,
    } = Joi.object<ICreateBody>({
      name: Joi.string().trim().required(),
      status: Joi.string()
        .trim()
        .valid(...Object.values(ProductStatuses))
        .required(),
      description: Joi.string().trim().min(0).optional(),
      price: Joi.number().positive().required(),
      categories: Joi.array().items(Joi.string().trim().optional()).optional(),
      additionalGroups: Joi.array<IAdditionalGroup[]>()
        .items({
          name: Joi.string().trim().required(),
          minLimit: Joi.number().min(0).optional().default(0),
          maxLimit: Joi.number().min(0).optional().default(0),
          required: Joi.boolean().required(),
          additionals: Joi.array().items(Joi.string().trim().required()),
        })
        .optional(),
    }).validate({
      ...request.body,
      categories: JSON.parse(request.body.categories || "[]"),
      additionalGroups: JSON.parse(request.body.additionalGroups || "[]"),
    });

    if (error) {
      return response.status(422).json(error);
    }

    await queryRunner.startTransaction();

    body.categories = await this.categoryRepository.find({
      where: {
        companyId: manager.company.id,
        id: In(body.categories as string[]),
      },
    });
    const product = await queryRunner.manager.save(
      Product,
      this.productRepository.create({
        ...body,
        companyId: manager.company.id,
      } as Partial<Product>)
    );
    product.images = await Promise.all(
      (request.files as unknown as Express.Multer.File[]).map(async (image) => {
        const fileName = `${v4()}.${image.mimetype.split("/")[1]}`;
        const productImage = this.productImageRepository.create({
          productId: product.id,
          type: FileTypes.ProductImage,
          fileName: fileName,
        });

        await Jetpack.upload({
          data: image.buffer,
          fileName: `${productImage.type}/${fileName}`,
        });

        await queryRunner.manager.save(productImage);

        return productImage;
      })
    );
    product.additionalGroups = await Promise.all(
      bodyAdditionalGroups.map(async (bodyAdditionalGroup: IAdditionalGroup) => {
        const additionals = await this.additionalRepository.find({
          where: {
            id: In(bodyAdditionalGroup.additionals),
            companyId: manager.company.id,
          },
        });

        const additionalGroup = this.additionalGroupRepository.create({
          companyId: manager.company.id,
          name: bodyAdditionalGroup.name,
          minLimit: bodyAdditionalGroup.minLimit,
          maxLimit: bodyAdditionalGroup.maxLimit,
          required: bodyAdditionalGroup.required,
          additionals,
          productId: product.id,
        });
        await queryRunner.manager.save(AdditionalGroup, additionalGroup);

        return additionalGroup;
      })
    );
    await queryRunner.manager.save(Product, product);
    await queryRunner.commitTransaction();
    await queryRunner.release();

    return response.status(201).json(this.ProductDTO.from(product));
  }

  private static async _update(request: Request, response: Response) {
    const queryRunner = dataSource.createQueryRunner();
    const manager = request.auth!.manager!;

    const { value: body, error } = Joi.object<IUpdateBody>({
      name: Joi.string().trim().optional(),
      status: Joi.string()
        .trim()
        .valid(...Object.values(ProductStatuses))
        .optional(),
      description: Joi.string().trim().min(0).optional(),
      price: Joi.number().positive().optional(),
      categories: Joi.array().items(Joi.string().trim().optional()).optional(),
      additionalGroups: Joi.array<IAdditionalGroup[]>()
        .items({
          name: Joi.string().trim().optional(),
          minLimit: Joi.number().min(0).optional(),
          maxLimit: Joi.number().min(0).optional(),
          required: Joi.boolean().optional(),
          additionals: Joi.array().items(Joi.string().trim().optional()).optional(),
        })
        .optional(),
    }).validate({
      ...request.body,
      categories: JSON.parse(request.body.categories || "[]"),
      additionalGroups: JSON.parse(request.body.additionalGroups || "[]"),
    });

    if (error) {
      return response.status(422).json(error);
    }

    const existingProduct = await this.productRepository.findOne({
      where: { id: request.params.id, companyId: manager.company.id },
      relations: ["images"],
    });

    if (!existingProduct) throw new NotFoundError("Product não encontrado");

    await queryRunner.startTransaction();

    body.categories = await this.categoryRepository.find({
      where: {
        companyId: manager.company.id,
        id: In(body.categories as string[]),
      },
    });
    body.additionalGroups = await Promise.all(
      body.additionalGroups.map(async (bodyAdditionalGroup) => {
        const additionals = await this.additionalRepository.find({
          where: {
            id: In((bodyAdditionalGroup as IAdditionalGroup).additionals),
            companyId: manager.company.id,
          },
        });
        const additionalGroup = await this.additionalGroupRepository.save(
          this.additionalGroupRepository.create({
            name: (bodyAdditionalGroup as IAdditionalGroup).name,
            additionals,
            minLimit: (bodyAdditionalGroup as IAdditionalGroup).minLimit,
            maxLimit: (bodyAdditionalGroup as IAdditionalGroup).maxLimit,
            companyId: manager.company.id,
            productId: existingProduct.id,
          })
        );

        return additionalGroup;
      })
    );
    const product = await this.productRepository.save(this.productRepository.merge(existingProduct, body as Partial<Product>));

    if (!request.files?.length) {
      await queryRunner.manager.save(Product, product);
      await queryRunner.commitTransaction();

      return response.status(200).json(this.ProductDTO.from(product));
    }

    product.images = await Promise.all(
      (request.files as unknown as Express.Multer.File[]).map(async (image) => {
        const extname = image.mimetype.split("/")[1];
        const fileName = `${v4()}.${extname}`;

        const productImage = this.productImageRepository.create({
          productId: product.id,
          type: FileTypes.ProductImage,
          fileName: fileName,
        });

        await Jetpack.upload({
          data: image.buffer,
          fileName: `${productImage.type}/${fileName}`,
        });

        await queryRunner.manager.save(productImage);

        return productImage;
      })
    );

    await queryRunner.manager.save(Product, product);
    await queryRunner.commitTransaction();
    await queryRunner.release();

    return response.status(200).json(this.ProductDTO.from(product));
  }

  private static async _destroy(request: Request, response: Response) {
    const manager = request.auth!.manager!;
    const product = await this.productRepository.findOne({
      where: { id: request.params.id, companyId: manager.companyId! },
      relations: ["images"],
    });

    if (!product) throw new NotFoundError("Product não encontrado");

    await this.productRepository.remove(product);

    return response.status(204).end();
  }

  public static index = ProductController._index.bind(ProductController);
  public static show = ProductController._show.bind(ProductController);
  public static store = ProductController._store.bind(ProductController);
  public static update = ProductController._update.bind(ProductController);
  public static destroy = ProductController._destroy.bind(ProductController);
}
