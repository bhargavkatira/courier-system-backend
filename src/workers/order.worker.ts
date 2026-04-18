import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import Order from "../models/order.model";
import { getToken } from "../services/urbanebolt/auth.service";

const worker = new Worker(
  "orderQueue",
  async (job) => {
    const { orderId } = job.data;

    console.log("Processing order:", orderId);

    const order = await Order.findById(orderId);
    if (!order) return;

    let token = await getToken();

    const payload = [
      {
        ...order.payload,
        orderNumber: order.orderNumber
      }
    ];

    try {
      const res = await axios.post(
        "https://uat.urbanebolt.in/api/v1/services/manifest/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Urbanebolt response:", res.data);

      order.status = "IN_TRANSIT";
      order.trackingId =
        res?.data?.data?.[0]?.awbNumber || "TRK_" + Date.now();

      await order.save();

    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Token expired, retrying...");

        await redisConnection.del("ub_token");

        token = await getToken();

        // retry once
        const retry = await axios.post(
          "https://uat.urbanebolt.in/api/v1/services/manifest/",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        order.status = "IN_TRANSIT";
        order.trackingId =
          retry?.data?.data?.[0]?.awbNumber || "TRK_" + Date.now();

        await order.save();
        return;
      }

      console.error("Worker error:", err.message);

      order.status = "FAILED";
      await order.save();
    }
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log("Job completed:", job.id);
});