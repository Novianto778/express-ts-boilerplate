import { validateRequest } from "@/common/utils/httpHandlers";
import express from "express";
import { authController } from "./authController";
import { LoginSchema, RefreshSchema, RegisterSchema } from "./authModel";

export const authRouter = express.Router();

authRouter.post("/login", validateRequest(LoginSchema), authController.login);
authRouter.post("/register", validateRequest(RegisterSchema), authController.register);
authRouter.post("/refresh", validateRequest(RefreshSchema), authController.refresh);
