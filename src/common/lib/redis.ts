import KeyvRedis, { Keyv } from "@keyv/redis";
import { trackMetrics } from "../utils/cache";
import { env } from "../utils/envConfig";

export const redisOptions = {
  url: env.REDIS_URL, // The Redis server URL (use 'rediss' for TLS)
  socket: {
    host: "localhost", // Hostname of the Redis server
    port: 6379, // Port number
    reconnectStrategy: (retries: number) => Math.min(retries * 50, 2000), // Custom reconnect logic
    tls: false, // Enable TLS if you need to connect over SSL
    keepAlive: 30000, // Keep-alive timeout (in milliseconds)
  },
};

//  Redis Store
export const redisStore = trackMetrics(
  new Keyv({
    store: new KeyvRedis(redisOptions),
  }),
  "Redis",
);
