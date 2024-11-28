export class ApiError extends Error {
  public readonly statusCode: number = 500;

  /**
   *
   */
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
