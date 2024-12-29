import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, Response } from "express";
import { authService } from "./authService";

class AuthController {
  async login(req: Request, res: Response) {
    const serviceResponse = await authService.login(req.body);
    res.cookie("refreshToken", serviceResponse.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return handleServiceResponse(serviceResponse, res);
  }

  async register(req: Request, res: Response) {
    const serviceResponse = await authService.register(req.body);
    return handleServiceResponse(serviceResponse, res);
  }

  async logout(req: Request, res: Response) {
    const serviceResponse = await authService.logout(req.body);
    res.clearCookie("refreshToken");
    return handleServiceResponse(serviceResponse, res);
  }

  async refresh(req: Request, res: Response) {
    const serviceResponse = await authService.refreshToken(req.body);
    res.cookie("refreshToken", serviceResponse.data?.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return handleServiceResponse(serviceResponse, res);
  }
}

export const authController = new AuthController();
