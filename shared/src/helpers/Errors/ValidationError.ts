import { ApiError } from "./ApiError";

export class ValidationError extends ApiError {
  /**
   *
   */
  constructor(message: string) {
    super(422, message);
  }
}
