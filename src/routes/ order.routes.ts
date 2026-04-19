import express from "express";
import { createOrderController, getOrderByAwbController, getOrderController } from "../controllers/order.controller";
import { validate } from "../middleware/validate";
import { orderParamsSchema, orderSchema } from "../validators/order.validator";
const router = express.Router();

router.post("/orders",validate(orderSchema), createOrderController);
router.get("/orders/:id", validate(orderParamsSchema), getOrderController);
router.get("/orders/awb/:awb",getOrderByAwbController )
export default router;