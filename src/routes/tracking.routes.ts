import express from "express";
import { getTrackingController } from "../controllers/tracking.controller";
import { validate } from "../middleware/validate";
import { trackingParamsSchema } from "../validators/tracking.validator";


const router = express.Router();
router.get("/:awb", validate(trackingParamsSchema, "params"),
    getTrackingController);

export default router;