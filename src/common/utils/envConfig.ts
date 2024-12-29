import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  DATABASE_URL: str(),
  REDIS_URL: str({
    devDefault: testOnly("redis://localhost:6379"),
  }),
  PG_CON: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_EXPIRES_IN: str({ devDefault: testOnly("15m") }),
  JWT_REFRESH_EXPIRES_IN: str({ devDefault: testOnly("7d") }),
});
