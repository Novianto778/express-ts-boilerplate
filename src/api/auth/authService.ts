import { redisStore } from "@/common/lib/redis";
import { AppError } from "@/common/models/errorModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { comparePassword, hashPassword } from "@/common/utils/bcrypt";
import { env } from "@/common/utils/envConfig";
import jwt from "jsonwebtoken";
import ms from "ms";
import { UserRepository } from "../user/userRepository";
import type { LoginRequest, LogoutRequest, RefreshRequest, RegisterRequest, Token } from "./authModel";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Generate Tokens
  private generateTokens(payload: object): Token {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  // Login logic
  async login(loginRequest: LoginRequest): Promise<ServiceResponse<Token | null>> {
    const user = await this.userRepository.findByEmail(loginRequest.email);

    if (!user || !(await comparePassword(loginRequest.password, user.password))) {
      throw new AppError("Invalid email or password");
    }

    const tokens = this.generateTokens({ id: user.id, role: user.role });

    await this.saveRefreshToken(tokens.refreshToken);

    return ServiceResponse.success<Token>("User logged in", tokens);
  }

  // Register logic
  async register(registerRequest: RegisterRequest): Promise<ServiceResponse<Token | null>> {
    const existingUser = await this.userRepository.findByEmail(registerRequest.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(registerRequest.password);
    const user = await this.userRepository.createAsync({
      ...registerRequest,
      password: hashedPassword,
    });

    const tokens = this.generateTokens({ id: user.id, role: user.role });

    return ServiceResponse.success<Token>("User registered", tokens);
  }

  // logout logic
  async logout(logoutRequest: LogoutRequest): Promise<ServiceResponse<null>> {
    await this.revokeRefreshToken(logoutRequest.refreshToken);
    return ServiceResponse.success<null>("User logged out", null);
  }

  // Refresh token logic
  async refreshToken(refreshRequest: RefreshRequest): Promise<ServiceResponse<Token | null>> {
    const isValid = await this.validateRefreshToken(refreshRequest.refreshToken);

    const { id: userId } = this.verifyToken(refreshRequest.refreshToken) as any;

    if (!isValid) {
      throw new AppError("Invalid refresh token");
    }

    const tokens = this.generateTokens({ id: userId });

    return ServiceResponse.success<Token>("Token refreshed", tokens);
  }

  // Verify token
  private verifyToken(token: string): object | string {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
  }

  async saveRefreshToken(refreshToken: string) {
    const key = `refreshToken:${refreshToken}`;
    await redisStore.set(key, refreshToken, ms(env.JWT_REFRESH_EXPIRES_IN)); // 30 days
  }

  // Validate refresh token
  private async validateRefreshToken(oldRefreshToken: string): Promise<boolean> {
    const key = `refreshToken:${oldRefreshToken}`;
    const exists = await redisStore.get(key);
    return !!exists;
  }

  // Revoke refresh token
  private async revokeRefreshToken(oldRefreshToken: string) {
    const key = `refreshToken:${oldRefreshToken}`;
    await redisStore.delete(key);
  }
}

export const authService = new AuthService();
