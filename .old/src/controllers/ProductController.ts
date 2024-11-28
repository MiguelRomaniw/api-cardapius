import { Request, Response } from "express";
import { AppContext } from "Src/helpers/AppContext";
import { NotFoundError } from "Src/helpers/Errors";

export class ProductController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    const product = await this.productRepository.findOne({
      where: {
        id: request.params.id,
      },
      relations: ["additionalGroups", "additionalGroups.additionals", "images"],
    });

    if (!product) {
      throw new NotFoundError("Produto não encontrado");
    }

    return response.status(200).json(product);
  }

  private static async _store(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = ProductController._index.bind(ProductController);
  public static show = ProductController._show.bind(ProductController);
  public static store = ProductController._store.bind(ProductController);
  public static update = ProductController._update.bind(ProductController);
  public static destroy = ProductController._destroy.bind(ProductController);
}
