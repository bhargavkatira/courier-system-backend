import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const orderQueue = new Queue("orderQueue", {
  connection: redisConnection
});