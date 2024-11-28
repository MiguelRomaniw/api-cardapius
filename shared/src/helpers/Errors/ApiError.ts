export class ApiError extends Error {
  public readonly statusCode: number = 500;
  public readonly errors: string[] = [];

  /**
   *
   */
  constructor(statusCode: number, message: string, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
