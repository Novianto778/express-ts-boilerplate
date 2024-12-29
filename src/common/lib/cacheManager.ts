import { logger } from "@/server";
import KeyvPostgres from "@keyv/postgres";
import { createCache } from "cache-manager";
import { CacheableMemory } from "cacheable";
import { Keyv } from "keyv";
import { trackMetrics } from "../utils/cache";
import { env } from "../utils/envConfig";
import { redisStore } from "./redis";

// Multiple stores
const cache = createCache({
  stores: [
    //  High performance in-memory cache with LRU and TTL
    trackMetrics(
      new Keyv({
        store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
      }),
      "Memory",
    ),

    redisStore,

    // postgres store
    trackMetrics(
      new Keyv({
        store: new KeyvPostgres({
          uri: env.PG_CON,
        }),
      }),
      "Postgres",
    ),
  ],
});

cache.on("set", ({ key, value, error }) => {
  logger.info(`Cache set: ${key} => ${JSON.stringify(value)}`);

  if (error) {
    logger.error(`Cache set error: ${error}`);
  }
});

cache.on("del", ({ key, error }) => {
  logger.info(`Cache del: ${key}`);

  if (error) {
    logger.error(`Cache del error: ${error}`);
  }
});

cache.on("clear", (error) => {
  if (error) {
    logger.error(`Cache clear error: ${error}`);
  }
});

cache.on("refresh", ({ key, value, error }) => {
  logger.info(`Cache refresh: ${key} => ${JSON.stringify(value)}`);
  if (error) {
    logger.error(`Cache refresh error: ${error}`);
  }
});

export const cacheManager = {
  get: async <T>(key: string): Promise<T | null> => {
    return cache.get(key);
  },
  /**
   *
   * @param key
   * @param value
   * @param ttl  time to live in milliseconds
   * @returns boolean
   */
  set: async (key: string, value: any, ttl?: number): Promise<boolean> => {
    return cache.set(key, value, ttl);
  },
  del: async (key: string): Promise<boolean> => {
    return cache.del(key);
  },
  clear: async (): Promise<boolean> => {
    return cache.clear();
  },
};
