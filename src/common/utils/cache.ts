import { logger } from "@/server";
import type Keyv from "keyv";

const cacheMetrics = {
  hits: { Memory: 0, Redis: 0, Postgres: 0 },
  misses: 0,
};

export function trackMetrics(store: Keyv<any>, storeName: keyof typeof cacheMetrics.hits) {
  const originalGet = store.get.bind(store);

  store.get = async (key) => {
    const result = await originalGet(key as string);
    if (result) {
      cacheMetrics.hits[storeName]++;
      logger.info(`[CACHE HIT] Store: ${storeName}, Key: ${key}`);
      logger.info(`[CACHE METRICS] ${JSON.stringify(cacheMetrics)}`);
    } else {
      cacheMetrics.misses++;
      logger.info(`[CACHE MISS] Key: ${key}`);
    }
    return result;
  };

  return store;
}
