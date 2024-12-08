import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodIssue } from "zod";

export class AuthenticationError extends Error {
  private statusCodes: StatusCodes;
  constructor(message = "You must be authenticated to do this action", statusCodes = StatusCodes.UNAUTHORIZED) {
    super(message);
    this.statusCodes = statusCodes;
  }

  getErrors() {
    return this.message;
  }

  getStatusCodes() {
    return this.statusCodes;
  }
}

export class ValidationError extends Error {
  private errors: ZodError;
  private statusCodes: StatusCodes;

  constructor(errors: ZodError, message = "An validation error occured", statusCodes = StatusCodes.BAD_REQUEST) {
    super(message);
    this.errors = errors;
    this.statusCodes = statusCodes;
  }

  getErrors() {
    return this.errors.issues
      .map((issue: ZodIssue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      })
      .join(", ");
  }

  getStatusCodes() {
    return this.statusCodes;
  }
}

export class AppError extends Error {
  private statusCodes: StatusCodes;
  constructor(message = "An error occured", statusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCodes = statusCodes;
  }

  getErrors() {
    return this.message;
  }

  getStatusCodes() {
    return this.statusCodes;
  }
}

export class PrismaClientError extends Error {
  private errors: PrismaClientKnownRequestError;
  private statusCodes: StatusCodes;

  constructor(errors: PrismaClientKnownRequestError, statusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
    super("A prisma error occured");
    this.errors = errors;
    this.statusCodes = statusCodes;
  }

  getErrors() {
    switch (this.errors.code) {
      case "P2002":
        return `Duplicate field value ${this.errors.meta?.target}`;
      case "P2014":
        return `Invalid ID ${this.errors.meta?.target}`;
      case "P2003":
        return `Invalid input data ${this.errors.meta?.target}`;
      default:
        return `Something went wrong ${this.errors.meta?.target}`;
    }
  }

  getStatusCodes() {
    return this.statusCodes;
  }
}
