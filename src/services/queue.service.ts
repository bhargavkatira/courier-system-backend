
import axios from "axios";
import { Job, Queue, Worker } from "bullmq";
import config from "../config";
import { connectDB } from "../config/db";
import { redisConnection } from "../config/redis";
import orderModel from "../models/order.model";
import { getToken } from "./urbanebolt/auth.service";
const baseURL = config.BASE_URL;


export const orderQueue = new Queue("orderQueue", {
    connection: redisConnection
});

export const trackingQueue = new Queue("trackingQueue", {
    connection: redisConnection
});

async function startWorker() {
    try {
        await connectDB();
        console.log("✅ MongoDB connected for worker");
    } catch (err: any) {
        console.error("❌ MongoDB connection failed in worker", err);
        throw err;
    }


    const orderWorker = new Worker(
        "orderQueue",
        async (job: Job) => {

            const { orderId } = job.data;

            console.log("Processing order:", orderId);

            const order = await orderModel.findById(orderId);
            if (!order) return;

            let token = await getToken();
                const {
                _id,
                __v,
                userId,
                status,
                trackingId,
                ...rawPayload
                } = order.toObject();
           
            try {
                const res = await axios.post(
                    `${baseURL}/services/manifest/`,
                    [rawPayload],
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                order.status =
                    res.data?.successResponse?.[0]?.status || "IN_TRANSIT";

                // console.log(res, 59);
                
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
                        `${baseURL}/services/manifest/`,
                        order,
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
                        return { delivered: true };
        },
        {
            connection : redisConnection, 
            limiter : {
                 max : 1,
                 duration : 1000
            }
        }
    );


    orderWorker.on("completed", (job) => {
        console.log(`[bullMQ]: contact job ${job.id} completed`);
    });

    orderWorker.on("failed", (job, err) => {
        console.error(`[bullMQ]: contact job ${job?.id} failed`, err);
    });

    console.log(" BullMQ Worker orderQueue started");
}

startWorker().catch((err) => {
    console.error("❌ Worker startup failed:", err);
    process.exit(1);
});
