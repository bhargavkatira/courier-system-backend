import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";

const worker = new Worker(
  "trackingQueue",
  async (job) => {
    const { awb } = job.data;

    console.log("🔄 Refresh tracking:", awb);

    const res = await axios.get(
      `https://uat.urbanebolt.in/api/v1/services/tracking-pub/?awb=${awb}`
    );

    const data = res.data;

    await redisConnection.set(
      `tracking:${awb}`,
      JSON.stringify(data),
      "EX",
      6 * 60 * 60
    );

    console.log("✅ Tracking updated");
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);