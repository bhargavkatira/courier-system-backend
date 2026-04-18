import mongoose, { Document } from "mongoose";

export interface OrderDocument extends Document {
  userId: string;
  orderNumber : string;
  status: string;
  trackingId?: string;
  payload?: Object;
}

const orderSchema = new mongoose.Schema<OrderDocument>({
  userId: { type: String, required: true },
  orderNumber : { type: String, required: true },
  status: {
    type: String,
    default: "CREATED"
  },
  payload : Object,
  trackingId: String
}, { timestamps: true });

export default mongoose.model<OrderDocument>("Order", orderSchema);