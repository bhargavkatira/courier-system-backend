import { Request, Response } from "express";
import { fetchAndSyncTracking } from "../services/urbanebolt/tracking.service";

export const getTrackingController = async (req: Request, res: Response) => {
  try {
    const { awb } = req.params;
    const data = await fetchAndSyncTracking(awb as string);
    res.status(200).json(data);
  } catch (err: any) {
    console.error("Tracking error:", err.message);
    res.status(500).json({
      error: err.message || "Failed to fetch tracking"
    });
  }
};