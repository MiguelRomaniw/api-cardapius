import { AppContext } from "Shared/helpers/AppContext";
import { NotFoundError } from "Shared/helpers/Errors";
import { Request, Response } from "express";
import Joi from "joi";

interface ICreateBody {
  name: string;
  description: string;
  price: number;
}

interface IUpdateBody {
  name: string;
  description: string;
  price: number;
}

export class AdditionalController extends AppContext {
  private static async _index(request: Request, response: Response) {
    const [additionals, count] = await this.additionalRepository.findAndCount({
      where: {
        companyId: request.auth!.company!.id,
      },
      ...request.pagination?.toQuery(),
    });

    return response.status(200).json({
      additionals: this.AdditionalDTO.from(additionals),
      count,
      ...request.pagination?.toResponse(),
    });
  }

  private static async _show(request: Request, response: Response) {
    const additional = await this.additionalRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
    });

    if (!additional) throw new NotFoundError("Adicional não encontrado");

    return response.status(200).json(this.AdditionalDTO.from(additional));
  }

  private static async _store(request: Request, response: Response) {
    const company = request.auth!.company!;
    const { value: body, error } = Joi.object<ICreateBody>({
      name: Joi.string().trim().required(),
      description: Joi.string().trim().optional(),
      price: Joi.number().min(0).required(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const additional = await this.additionalRepository.save(
      this.additionalRepository.create({
        company: company,
        ...body,
      })
    );

    return response.status(201).json(this.AdditionalDTO.from(additional));
  }

  private static async _update(request: Request, response: Response) {
    const company = request.auth!.company!;
    const { value: body, error } = Joi.object<IUpdateBody>({
      name: Joi.string().trim().optional(),
      description: Joi.string().trim().optional(),
      price: Joi.number().min(0).optional(),
    }).validate(request.body);

    if (error) {
      return response.status(422).json(error);
    }

    const additional = await this.additionalRepository.findOne({
      where: {
        id: request.params.id,
        companyId: company.id,
      },
    });

    if (!additional) throw new NotFoundError("Adicional não encontrado");

    const updatedAdditional = await this.additionalRepository.save(this.additionalRepository.merge(additional, body));

    return response.status(200).json(this.AdditionalDTO.from(updatedAdditional));
  }

  private static async _destroy(request: Request, response: Response) {
    // TODO: implement soft remove and restore

    const additional = await this.additionalRepository.findOne({
      where: {
        id: request.params.id,
        companyId: request.auth!.company!.id,
      },
    });

    if (!additional) throw new NotFoundError("Adicional não encontrado");

    await this.additionalRepository.remove(additional);

    return response.status(204).end();
  }

  public static index = AdditionalController._index.bind(AdditionalController);
  public static show = AdditionalController._show.bind(AdditionalController);
  public static store = AdditionalController._store.bind(AdditionalController);
  public static update = AdditionalController._update.bind(AdditionalController);
  public static destroy = AdditionalController._destroy.bind(AdditionalController);
}
