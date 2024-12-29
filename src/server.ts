import cors from "cors";
import express, { type Express } from "express";
import "express-async-errors";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import errorMiddleware from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { StatusCodes } from "http-status-codes";
import { authRouter } from "./api/auth/authRouter";
import { cacheManager } from "./common/lib/cacheManager";
import authenticateToken from "./common/middleware/authenticateToken";
import { AppError } from "./common/models/errorModel";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/clear-cache", async (req, res) => {
  await cacheManager.clear();
  res.json({ message: "Cache cleared" });
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "Protected route" });
});

// Swagger UI
app.use(openAPIRouter);

// catch non-existing routes
app.use(() => {
  throw new AppError("Route not found", StatusCodes.NOT_FOUND);
});
// Error handlers
app.use(errorMiddleware());

export { app, logger };
