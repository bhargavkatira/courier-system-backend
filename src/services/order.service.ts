import mongoose from "mongoose";
import { redisConnection } from "../config/redis";
import Order from "../models/order.model";
import { generateUUID } from "../utils/common";
import { orderQueue } from "./queue.service";

export const createOrder = async (order: any) => {

  const orderNumber = generateUUID();;

  const savedOrder = await Order.create({
    userId: order.customerCode || "guest",
    orderNumber,
    ...order,
    status : "Create"
  });

  await orderQueue.add("orderQueue", {
    orderId: savedOrder._id.toString()
  });
    
  return savedOrder;

};

export const getOrderById = async (id: string) => {
  const cacheKey = `order:${id}`;

  const cached = await redisConnection.get(cacheKey);
  if (cached) {
    console.log("Cache hit ✅");
    return JSON.parse(cached);
  }

  let order;

  const projection = "scans shipmentStatus trackingId userId";

  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id).select(projection);
  } else {
    order = await Order.findOne({ orderNumber: id }).select(projection);
  }

  if (!order) {
    throw new Error("Order not found");
  }

  await redisConnection.set(cacheKey, JSON.stringify(order), "EX", 60);

  return order;
};


export const getOrderByAwb = async (awb: string) => {
  const cacheKey = `order:awb:${awb}`;

  const cached = await redisConnection.get(cacheKey);
  if (cached) {
    console.log("Cache hit ✅");
    return JSON.parse(cached);
  }

  const order = await Order.findOne({ trackingId: awb })
    .select("scans shipmentStatus trackingId userId")
    .lean();

  if (!order) {
    throw new Error("Order not found");
  }

  await redisConnection.set(cacheKey, JSON.stringify(order), "EX", 60);

  return order;
};