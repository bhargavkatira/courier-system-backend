import axios from "axios";
import config from "../config";
import { redisConnection } from "../config/redis";

const BaseURL = config.BASE_URL;

export const getTracking = async (awb: string) => {
  const cacheKey = `tracking:${awb}`;
   
  // 🔥 1. Check cache
  const cached = await redisConnection.get(cacheKey);

  if (cached) {
    console.log("Cache HIT ✅");
    return JSON.parse(cached);
  }

  console.log("Cache MISS");

// add try and catch
const res = await axios.get(
      `${BaseURL}/services/tracking-pub/?awb=${awb}`
    );

    const data = res.data;

    await redisConnection.set(
      `tracking:${awb}`,
      JSON.stringify(data),
      "EX",
      6 * 60 * 60
    );
  // 🔥 3. Return immediate response
  return {
    data : data,
    awb
  };
};