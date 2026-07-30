import { Redis } from "ioredis";
import "dotenv/config";
import logger from "../utils/logger";

const shouldUseRedis =
  process.env.NODE_ENV === "production" || process.env.REDIS_ENABLED === "true";

if (process.env.NODE_ENV === "production" && !process.env.REDIS_URL) {
  throw new Error("REDIS_URL es obligatorio en produccion");
}

const redisClient =
  shouldUseRedis && process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
        enableOfflineQueue: false,
        maxRetriesPerRequest: 1,
        retryStrategy: () => null,
      })
    : null;

redisClient?.on("error", (error) => {
  logger.warn({ err: error }, "Redis no disponible; usando almacenamiento principal");
});

export default redisClient;
