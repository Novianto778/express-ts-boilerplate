import type { Request } from "express";
import { rateLimit } from "express-rate-limit";

import { env } from "@/common/utils/envConfig";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "../models/serviceResponse";
import { handleServiceResponse } from "../utils/httpHandlers";

const rateLimiter = rateLimit({
  legacyHeaders: true,
  limit: env.COMMON_RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  windowMs: 15 * 60 * env.COMMON_RATE_LIMIT_WINDOW_MS,
  keyGenerator: (req: Request) => req.ip as string,
  handler: (_req, res) => {
    const response = ServiceResponse.failure(
      "Too many requests, please try again later.",
      null,
      StatusCodes.TOO_MANY_REQUESTS,
    );
    return handleServiceResponse(response, res);
  },
});

export default rateLimiter;
