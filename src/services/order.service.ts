import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { redisConnection } from "../config/redis";
import Order from "../models/order.model";
import { orderQueue } from "./queue.service";
import { getToken } from "./urbanebolt/auth.service";


export const generateUUID = (): string => {
  return uuidv4();
};
export const createOrder = async (order: any) => {
  console.log("Incoming data:", order);

  const token = await getToken();

  const orderNumber = generateUUID();;


  const savedOrder = await Order.create({
    userId: order.customerCode || "guest",
    orderNumber,
    ...order,
    status : "Create"
  });

  console.log("Saved Order:", savedOrder);

  await orderQueue.add("processOrder", {
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