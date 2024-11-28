import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";
import { Request, Response } from "express";

export class CompanyController extends AppContext {
  private static async _index(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _show(request: Request, response: Response) {
    const subdomain = request.query.subdomain as string;
    const company = await this.companyRepository.findOne({
      where: {
        subdomain: subdomain,
      },
      relations: ["menus", "menus.productGroups", "menus.productGroups.products", "menus.productGroups.products.images"],
    });

    if (!company) throw new NotFoundError("Empresa não encontrada");

    return response.status(200).json(this.CompanyDTO.from(company));
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

  public static index = CompanyController._index.bind(CompanyController);
  public static show = CompanyController._show.bind(CompanyController);
  public static store = CompanyController._store.bind(CompanyController);
  public static update = CompanyController._update.bind(CompanyController);
  public static destroy = CompanyController._destroy.bind(CompanyController);
}
