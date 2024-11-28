import { NextFunction, Request, Response } from "express";

export const serialize_form_data_json_middleware = (request: Request, response: Response, next: NextFunction) => {
  for (const [key, value] of Object.entries(request.body)) {
    try {
      const json = JSON.parse(value as string);

      request.body[key] = json;
    } catch (error) {
      // console.log(error);
    }
  }

  next();
};
