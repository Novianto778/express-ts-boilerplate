import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { join } from "node:path";
import { env } from "@/common/utils/envConfig";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { type LevelWithSilent, pino } from "pino";
import { type CustomAttributeKeys, type Options, pinoHttp } from "pino-http";

enum LogLevel {
  Fatal = "fatal",
  Error = "error",
  Warn = "warn",
  Info = "info",
  Debug = "debug",
  Trace = "trace",
  Silent = "silent",
}

type PinoCustomProps = {
  request: Request;
  response: Response;
  error: Error;
  responseBody: unknown;
};

const appStreamTransport = pino.transport({
  target: "pino-roll",
  options: {
    file: join("logs", new Date().toISOString().split("T")[0], "app.log"),
    frequency: "daily",
    mkdir: true,
    dateFormat: "yyyy-MM-dd",
  },
});

const errorStreamTransport = pino.transport({
  target: "pino-roll",
  options: {
    file: join("logs", new Date().toISOString().split("T")[0], "error.log"),
    frequency: "daily",
    mkdir: true,
    dateFormat: "yyyy-MM-dd",
  },
});

const streams = [
  {
    level: "info",
    stream: appStreamTransport,
  },
  {
    level: "error",
    stream: errorStreamTransport,
  },
];

const redact = ["req.headers.authorization", "req.body.password"];

const requestLogger = (options?: Options): RequestHandler[] => {
  const pinoOptions: Options = {
    enabled: env.isProduction,
    customProps: customProps as unknown as Options["customProps"],
    redact: {
      paths: redact,
      censor: "[REDACTED]",
    },
    genReqId,
    customLogLevel,
    customSuccessMessage,
    customReceivedMessage: (req) => `request received: ${req.method}`,
    customErrorMessage: (_req, res) => `request errored with status code: ${res.statusCode}`,
    customAttributeKeys,
    timestamp: pino.stdTimeFunctions.isoTime,
    ...options,
  };
  return [responseBodyMiddleware, pinoHttp(pinoOptions, pino.multistream(streams))];
};

const customAttributeKeys: CustomAttributeKeys = {
  req: "request",
  res: "response",
  err: "error",
  responseTime: "timeTaken",
};

const customProps = (req: Request, res: Response): PinoCustomProps => ({
  request: req,
  response: res,
  error: res.locals.err,
  responseBody: res.locals.responseBody,
});

const responseBodyMiddleware: RequestHandler = (_req, res, next) => {
  const isNotProduction = !env.isProduction;
  if (isNotProduction) {
    const originalSend = res.send;
    res.send = (content) => {
      res.locals.responseBody = content;
      res.send = originalSend;
      return originalSend.call(res, content);
    };
  }
  next();
};

const customLogLevel = (_req: IncomingMessage, res: ServerResponse<IncomingMessage>, err?: Error): LevelWithSilent => {
  if (err || res.statusCode >= StatusCodes.INTERNAL_SERVER_ERROR) return LogLevel.Error;
  if (res.statusCode >= StatusCodes.BAD_REQUEST) return LogLevel.Warn;
  if (res.statusCode >= StatusCodes.MULTIPLE_CHOICES) return LogLevel.Silent;
  return LogLevel.Info;
};

const customSuccessMessage = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  if (res.statusCode === StatusCodes.NOT_FOUND) return getReasonPhrase(StatusCodes.NOT_FOUND);
  return `${req.method} completed`;
};

const genReqId = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const existingID = req.id ?? req.headers["x-request-id"];
  if (existingID) return existingID;
  const id = randomUUID();
  res.setHeader("X-Request-Id", id);
  return id;
};

export default requestLogger();
