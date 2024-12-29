import jwt from "jsonwebtoken";
import { env } from "./envConfig";

export function generateAccessToken(payload: object) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function generateRefreshToken(payload: object) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
