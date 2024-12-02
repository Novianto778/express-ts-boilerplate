import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodIssue } from "zod";

export class AuthenticationError extends Error {
  private status;
  private statusCodes: StatusCodes;
  constructor(
    message = "You must be authenticated to do this action",
    status = 401,
    statusCodes = StatusCodes.UNAUTHORIZED,
  ) {
    super(message);
    this.status = status;
    this.statusCodes = statusCodes;
  }

  getStatus() {
    return this.status;
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

  constructor(errors: ZodError) {
    super("An validation error occured");
    this.errors = errors;
  }

  getErrors() {
    return this.errors.issues
      .map((issue: ZodIssue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      })
      .join(", ");
  }
}

export class AppError extends Error {
  private status;
  private statusCodes: StatusCodes;
  constructor(message = "An error occured", status = 500, statusCodes = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.status = status;
    this.statusCodes = statusCodes;
  }

  getStatus() {
    return this.status;
  }

  getErrors() {
    return this.message;
  }

  getStatusCodes() {
    return this.statusCodes;
  }
}
