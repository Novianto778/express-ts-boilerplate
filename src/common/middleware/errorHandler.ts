import { logger } from "@/server";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { AppError, AuthenticationError, ValidationError } from "../models/errorModel";
import { ServiceResponse } from "../models/serviceResponse";
import { handleServiceResponse } from "../utils/httpHandlers";

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(err, { message: err.message, url: req.originalUrl, method: req.method });

  if (err instanceof ZodError) {
    const errorMsg = err.issues
      .map((issue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      })
      .join(", ");

    const errorRes = ServiceResponse.failure(errorMsg, null, StatusCodes.BAD_REQUEST);
    return handleServiceResponse(errorRes, res);
  }

  if (err instanceof ValidationError) {
    const errorRes = ServiceResponse.failure(err.getErrors(), null, StatusCodes.BAD_REQUEST);
    return handleServiceResponse(errorRes, res);
  } else if (err instanceof AuthenticationError) {
    const errorRes = ServiceResponse.failure(err.getErrors(), null, StatusCodes.UNAUTHORIZED);
    return handleServiceResponse(errorRes, res);
  } else if (err instanceof AppError) {
    const errorRes = ServiceResponse.failure(err.message, null, StatusCodes.INTERNAL_SERVER_ERROR);
    return handleServiceResponse(errorRes, res);
  } else {
    const errorRes = ServiceResponse.failure("An error occurred", null, StatusCodes.INTERNAL_SERVER_ERROR);
    return handleServiceResponse(errorRes, res);
  }
};

export default () => [unexpectedRequest, addErrorToRequestLog];
