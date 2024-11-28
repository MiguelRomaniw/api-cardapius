import { NextFunction, Request, Response } from "express";
import { ApiError } from "Src/helpers/Errors";

export const express_async_errors_middleware = async (
  error: Error & ApiError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(error);

  const message = error.message;
  const status = error.statusCode ?? 500;

  return response.status(status).json({
    message: message,
  });
};
