import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { parseQueryParams } from "./queryParams";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const queryParams = parseQueryParams(req);

  schema.parse({ body: req.body, query: queryParams, params: req.params });
  next();
};
