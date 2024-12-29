import { z } from "zod";
import { UserCreateSchema } from "../user/userModel";

// Login Request Schema
export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

// Register User Schema (Reuses UserCreateSchema)
export const RegisterSchema = z.object({
  body: UserCreateSchema,
});

// Logout Request Schema
export const LogoutSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

// Refresh Token Request Schema
export const RefreshSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});

// JWT Token Schema
export const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

// Reuse Types
export type LoginRequest = z.infer<typeof LoginSchema>["body"];
export type RegisterRequest = z.infer<typeof RegisterSchema>["body"];
export type LogoutRequest = z.infer<typeof LogoutSchema>["body"];
export type RefreshRequest = z.infer<typeof RefreshSchema>["body"];
export type Token = z.infer<typeof TokenSchema>;
