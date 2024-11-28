import { ApiError } from "./ApiError";

export class TeapotError extends ApiError {
  /**
   *
   */
  constructor(message: string) {
    super(418, message);
  }
}
