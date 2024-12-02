import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { parseQueryParams } from "./queryParams";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest =
  (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const queryParams = parseQueryParams(req);

    if (schemas.params) schemas.params.parse(req.params);
    if (schemas.query) schemas.query.parse(queryParams);
    if (schemas.body) schemas.body.parse(req.body);
    next();
  };
