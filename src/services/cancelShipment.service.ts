import axios from "axios";
import config from "../config";
import orderModel from "../models/order.model";
import { getToken } from "./urbanebolt/auth.service";


let BaseURL = config.BASE_URL;

export const cancelShipment = async (awb: string) => {
    try {
        const token = await getToken();
        const response = await axios.post(
            `${BaseURL}/services/cancel/`,
            {
                awbs: awb,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const data = response.data;
        await updateOrderAfterCancel(data);

        return data;
    } catch (error: any) {
        console.error(
            "Cancel API failed:",
            error.response?.data || error.message
        );

        throw error;
    }
};

export const updateOrderAfterCancel = async (response: any) => {
    const successList = response?.successResponse || [];

    for (const item of successList) {
        const { orderNumber } = item;
        console.log(orderNumber, 48)
        await orderModel.findOneAndUpdate(
            { orderNumber },
            {
                $set: {
                    status: "CANCELLED",
                },
            },
            { new: true }
        );
    }
};