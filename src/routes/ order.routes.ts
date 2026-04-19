import express from "express";
import { createOrderController, getOrderController } from "../controllers/order.controller";
import { validate } from "../middleware/validate";
import { orderSchema } from "../validators/order.validator";
const router = express.Router();

router.post("/orders",validate(orderSchema), createOrderController);
router.get("/orders/:id", getOrderController);

export default router;