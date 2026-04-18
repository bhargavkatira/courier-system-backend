import axios from "axios";
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import Order from "../models/order.model";
import { getToken } from "../services/urbanebolt/auth.service";

const baseURI = process.env.URBAN_EBOLT_BASE_URL;
const worker = new Worker(
  "orderQueue",
  async (job) => {
    const { orderId } = job.data;

    console.log("Processing order:", orderId);

    const order = await Order.findById(orderId);
    if (!order) return;

    let token = await getToken();

    try {
      const res = await axios.post(
       `${baseURI}/services/manifest/`,
        order.payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );


      // 🔥 UPDATE ORDER
      order.status =
        res.data?.successResponse?.[0]?.status || "IN_TRANSIT";

      order.trackingId =
        res.data?.successResponse?.[0]?.awbNumber ||
        "TRK_" + Date.now();

      await order.save();

      console.log("Order saved:", order._id);

    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Token expired, retrying...");

        await redisConnection.del("ub_token");

        token = await getToken();

        const retry = await axios.post(
          `${baseURI}/services/manifest/`,
          order.payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        order.status =
          retry.data?.successResponse?.[0]?.status || "IN_TRANSIT";

        order.trackingId =
          retry.data?.successResponse?.[0]?.awbNumber ||
          "TRK_" + Date.now();

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