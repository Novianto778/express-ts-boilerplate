import type { ServiceResponse } from "@/common/models/serviceResponse";
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { parseQueryOrParams } from "./queryParams";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const query = parseQueryOrParams(req.query);
  const params = parseQueryOrParams(req.params);

  const result = schema.parse({ body: req.body, query, params });

  // manipulate the request object to include the validated data
  req.body = result.body;
  req.query = result.query;
  req.params = result.params;

  next();
};
