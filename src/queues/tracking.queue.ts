import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const trackingQueue = new Queue("trackingQueue", {
  connection: redisConnection
});