import express from "express";
import {
    createOrderController,
    getOrderController
} from "../controllers/order.controller";

const router = express.Router();

router.post("/orders", createOrderController);
router.get("/orders/:id", getOrderController);

export default router;