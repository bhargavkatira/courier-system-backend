import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { redisConnection } from "../config/redis";
import Order from "../models/order.model";
import { orderQueue } from "../queues/order.queue";
import { getToken } from "./urbanebolt/auth.service";
const baseURI = process.env.URBAN_EBOLT_BASE_URL;


export const generateUUID = (): string => {
  return uuidv4();
};
export const createOrder = async (order: any) => {
  console.log("Incoming data:", order);

  const token = await getToken();

  const shortId = generateUUID();
  const orderNumber = shortId;

  const payload = [
    {
      ...order,
      orderNumber
    }
  ];

  // ✅ Save in DB
  const savedOrder = await Order.create({
    userId: order.customerCode || "guest",
    status: "CREATED",
    orderNumber,
    payload
  });

  console.log("Saved Order:", savedOrder);

  // ✅ Push to queue (FIXED)
  await orderQueue.add("processOrder", {
    orderId: savedOrder._id.toString()
  });
    
  return savedOrder;


//   // ❗ OPTIONAL: remove below API call later (move to worker)
//   try {
//     const res = await axios.post(
//       `${baseURI}/services/manifest/`,
//       payload,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     savedOrder.status = res.data.successResponse?.[0]?.status || "IN_TRANSIT";

//     savedOrder.trackingId =
//       res.data.successResponse?.[0]?.awbNumber || "TRK_" + Date.now();

//     await savedOrder.save();

//     return savedOrder;

//   } catch (err: any) {
//     if (err.response?.status === 401) {
//       console.log("Token expired, refreshing...");

//       await redisConnection.del("ub_token");

//       const newToken = await getToken();

//       const retry = await axios.post(
//         `${baseURI}/services/manifest/`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${newToken}`,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       savedOrder.status =
//         retry.data.successResponse?.[0]?.status || "IN_TRANSIT";

//       savedOrder.trackingId =
//         retry.data.successResponse?.[0]?.awbNumber || "TRK_" + Date.now();

//       await savedOrder.save();

//       return savedOrder;
//     }

//     console.error("Urbanebolt error:", err.response?.data || err.message);

//     savedOrder.status = "FAILED";
//     await savedOrder.save();

//     throw err;
//   }
};

export const getOrderById = async (id: string) => {
  const cacheKey = `order:${id}`;

  const cached = await redisConnection.get(cacheKey);
  if (cached) {
    console.log("Cache hit ✅");
    return JSON.parse(cached);
  }

  let order;

  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id);
  } else {
    order = await Order.findOne({ orderNumber: id });
  }

  if (!order) {
    throw new Error("Order not found");
  }

  await redisConnection.set(cacheKey, JSON.stringify(order), "EX", 60);

  return order;
};