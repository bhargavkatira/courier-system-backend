import { Request, Response } from "express";
import { cancelShipment } from "../services/cancelShipment.service";

export const cancelOrderController = async (req: Request, res: Response) => {
    try {
        const { awb } = req.body;
        const result = await cancelShipment(awb);
        return res.status(200).json({
            success: true,
            message: "Shipment cancelled successfully",
            data: result,
        });
    } catch (error: any) {
        console.error("Cancel Controller Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message || "Cancellation failed",
        });
    }
};