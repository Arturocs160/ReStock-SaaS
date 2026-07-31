import { Redis } from "ioredis";
import "dotenv/config";

const redisClient = new Redis(process.env.REDIS_URL as string);

export default redisClient;
