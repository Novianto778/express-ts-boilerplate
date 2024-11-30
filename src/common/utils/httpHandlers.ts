import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { ValidationError } from "../models/errorModel";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  schema.parse({ body: req.body, query: req.query, params: req.params });
  next();
};
