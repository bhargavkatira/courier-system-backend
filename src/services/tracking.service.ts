import axios from "axios";
import { redisConnection } from "../config/redis";
import { trackingQueue } from "../queues/tracking.queue";

export const getTracking = async (awb: string) => {
  const cacheKey = `tracking:${awb}`;

  // 🔥 1. Check cache
  const cached = await redisConnection.get(cacheKey);

  if (cached) {
    console.log("Cache HIT ✅");
    return JSON.parse(cached);
  }

  console.log("Cache MISS");

  // 🔥 2. Push job to worker instead of calling API
  await trackingQueue.add("fetchTracking", { awb });

  // 🔥 3. Return immediate response
  return {
    status: "PROCESSING",
    message: "Tracking is being fetched",
    awb
  };
};