import { Router } from "express";
import { cancelOrderController } from "../controllers/cancelShipment.controller";
import { validate } from "../middleware/validate";
import { cancelOrderSchema } from "../validators/cance.validator";

const router = Router();

// POST /api/v1/cancel
router.post("/cancel",validate(cancelOrderSchema), cancelOrderController);

export default router;