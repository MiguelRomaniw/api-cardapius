import { NextFunction, Request, Response } from "express";

export const pagination = ({ defaultPage = 1, defaultPerPage = 10 }) => {
  return (request: Request, response: Response, next: NextFunction) => {
    try {
      const hasPagination = JSON.parse((request.query.hasPagination || "true") as string);
      const rawPage = request.query.page?.toString();
      const rawPerPage = request.query.perPage?.toString();
      const page = Math.abs(Math.floor(rawPage ? parseInt(rawPage) || defaultPage : defaultPage));
      const perPage = Math.abs(Math.floor(rawPerPage ? parseInt(rawPerPage) || defaultPerPage : defaultPerPage));

      request.pagination = {
        hasPagination,
        page: page,
        perPage: perPage,
        toQuery: () => {
          if (!hasPagination) return { skip: undefined, take: undefined };

          return {
            skip: perPage * (page - 1),
            take: perPage,
          };
        },
        toResponse: () => {
          if (!hasPagination) return {};

          return {
            page,
            perPage,
          };
        },
      };

      return next();
    } catch (error) {
      console.log(error);
      return response.status(500).json(error);
    }
  };
};
