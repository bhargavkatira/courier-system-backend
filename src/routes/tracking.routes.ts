import express from "express";
import { getTrackingController } from "../controllers/tracking.controller";

const router = express.Router();

router.get("/:awb", getTrackingController);

export default router;