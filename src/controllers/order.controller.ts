import { Request, Response } from "express";
import { createOrder, getOrderByAwb, getOrderById } from "../services/order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: err.message || "Failed to create order"
    });
  }
};

export const getOrderController = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const order = await getOrderById(id);
    res.json(order);
  } catch (err) {
    console.error("GET ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const getOrderByAwbController = async (req: Request, res: Response) => {
  try {
    const { awb } = req.params;
    const order = await getOrderByAwb(awb as string);
    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};