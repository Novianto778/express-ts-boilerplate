import { logger } from "@/server";
import { PrismaClientKnownRequestError, PrismaClientValidationError } from "@prisma/client/runtime/library";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { AppError, AuthenticationError, PrismaClientError, ValidationError } from "../models/errorModel";
import { ServiceResponse } from "../models/serviceResponse";
import { handleServiceResponse } from "../utils/httpHandlers";
import { zodErrorMessage } from "../utils/zodError";

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(err, {
    message: err.message,
    url: req.originalUrl,
    method: req.method,
  });

  if (err instanceof ZodError) {
    const errorMsg = zodErrorMessage(err);

    const errorRes = ServiceResponse.failure(errorMsg, null, StatusCodes.BAD_REQUEST);
    return handleServiceResponse(errorRes, res);
  }

  if (err instanceof ValidationError) {
    const errorRes = ServiceResponse.failure(err.getErrors(), null, err.getStatusCodes() || StatusCodes.BAD_REQUEST);
    return handleServiceResponse(errorRes, res);
  } else if (err instanceof AuthenticationError) {
    const errorRes = ServiceResponse.failure(err.getErrors(), null, err.getStatusCodes() || StatusCodes.UNAUTHORIZED);
    return handleServiceResponse(errorRes, res);
  } else if (err instanceof AppError) {
    const errorRes = ServiceResponse.failure(
      err.getErrors(),
      null,
      err.getStatusCodes() || StatusCodes.INTERNAL_SERVER_ERROR,
    );
    return handleServiceResponse(errorRes, res);
  } else if (err instanceof PrismaClientKnownRequestError) {
    const error = new PrismaClientError(err);
    const errorRes = ServiceResponse.failure(
      error.getErrors() || "A prisma error occurred",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
    return handleServiceResponse(errorRes, res);
  } else if (err instanceof PrismaClientValidationError) {
    const errorRes = ServiceResponse.failure("A prisma validation error occurred", null, StatusCodes.BAD_REQUEST);
    return handleServiceResponse(errorRes, res);
  } else {
    const errorRes = ServiceResponse.failure("An error occurred", null, StatusCodes.INTERNAL_SERVER_ERROR);
    return handleServiceResponse(errorRes, res);
  }
};

const errorMiddleware = () => [addErrorToRequestLog, globalErrorHandler, unexpectedRequest];

export default errorMiddleware;
