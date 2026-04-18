import axios from "axios";
import mongoose from "mongoose";
import { redisConnection } from "../config/redis";
import Order from "../models/order.model";
import { getToken } from "./urbanebolt/auth.service";

export const generateShortId = (): string => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

export const createOrder = async (order: any) => {
  let token = await getToken();
    const PREFIX = "UATTESTUEBCUS";

    const shortId = generateShortId();
    const orderNumber = shortId;
    const payload = [
    {
        ...order,          // spread object correctly
        orderNumber: `${PREFIX}${shortId}`
    }
    ];
    const createOrder = await Order.create({
        userId: order.customerCode,
        status: "CREATED",
        orderNumber : orderNumber,
        payload: payload
    });
    
 
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

    createOrder.status = res.data.successResponse[0].status;
    console.log(order.status);
    createOrder.trackingId =
      res.data.successResponse[0].awbNumber || "TRK_" + Date.now();

    await createOrder.save();
        
    return createOrder;

  } catch (err: any) {
    // 🔥 Token expired → retry
    if (err.response?.status === 401) {
      console.log("Token expired, refreshing...");

      await redisConnection.del("ub_token");

      token = await getToken();

      const retry = await axios.post(
        "https://uat.urbanebolt.in/api/v1/services/manifest/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      return retry.data;
    }

    console.error("Urbanebolt error:", err.response?.data || err.message);
    throw err;
  }
};

export const getOrderById = async (id: string) => {
  const cacheKey = `order:${id}`;

  // 🔹 1. Check cache
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