import axios from "axios";
import config from "../../config";
import orderModel from "../../models/order.model";
import { getToken } from "./auth.service";

const BASE_URL = config.BASE_URL;

// map external → internal status
const statusMap: Record<string, string> = {
  CAN: "CANCELLED",
  MAN: "MANIFESTED",
};

export const fetchAndSyncTracking = async (awb: string) => {
  try {
    const token = await getToken();
    const response = await axios.get(
      `${BASE_URL}/services/tracking-pub/`,
      {
        params: { awb },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response.data?.data;

    if (!data) throw new Error("No tracking data found");

    const currentStatus = data.currentStatusCode;

    // 🔹 transform scans
    const scans = data.scans.map((scan: any) => ({
      statusCode: scan.statusCode,
      status: scan.statusCodeDescription,
      dateTime: scan.statusDateTime,
      location: scan.currentLocation,
    }));

    // 🔹 update DB
    await orderModel.findOneAndUpdate(
      { orderNumber: data.orderNumber },
      {
        $set: {
          status: statusMap[currentStatus] || currentStatus,
          shipmentStatus: statusMap[currentStatus] || currentStatus,
          scans,
        },
      },
      { new: true }
    );

    return data;
  } catch (error: any) {
    console.error(
      "Tracking API failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};