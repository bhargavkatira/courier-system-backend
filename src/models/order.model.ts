import mongoose, { Document, Schema } from "mongoose";

export interface OrderDocument extends Document {
  userId: string;
  orderNumber: string;
  status: string;
  trackingId?: string;

  customerCode: string;
  declaredValue: number;
  itemDescription: string;
  collectableValue: number;

  height: number;
  length: number;
  breadth: number;
  weight: number;
  pieces: number;

  serviceType: string;
  payMode: string;

  rtnName: string;
  rtnMobile: number;
  rtnAddress: string;
  rtnCity: string;
  rtnState: string;
  rtnPincode: number;

  consName: string;
  consMobile: number;
  consAddress: string;
  consCity: string;
  consState: string;
  consPincode: number;

  invoiceNumber: string;
  invoiceDate: string;
  invoiceValue: number;

  shprName: String,
  shprAddress: String,
  shprAddressType: String,
  shprCity: String,
  shprState: String,
  shprPincode: Number,
  shprMobile: Number,
  rtnCountry: String,
  consAddressType: String,
  itemQuantity: Number
  shipmentStatus?: string;
  scans?: {
    statusCode: string;
    status: string;
    dateTime: string;
    location: string;
  }[];
}


const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    orderNumber: { type: String, required: true, unique: true },
    status: { type: String, required: true },
    trackingId: { type: String },

    customerCode: { type: String, required: true },
    declaredValue: { type: Number, required: true },
    itemDescription: { type: String, required: true },
    collectableValue: { type: Number },

    height: Number,
    length: Number,
    breadth: Number,
    weight: Number,
    pieces: Number,

    serviceType: String,
    payMode: String,

    rtnName: String,
    rtnMobile: Number,
    rtnAddress: String,
    rtnCity: String,
    rtnState: String,
    rtnPincode: Number,

    consName: String,
    consMobile: Number,
    consAddress: String,
    consCity: String,
    consState: String,
    consPincode: Number,

    invoiceNumber: String,
    invoiceDate: String,
    invoiceValue: Number,
    shprName: String,
    shprAddress: String,
    shprAddressType: String,
    shprCity: String,
    shprState: String,
    shprPincode: Number,
    shprMobile: Number,
    rtnCountry: String,
    consAddressType: String,
    itemQuantity: Number,
    shipmentStatus: String,
    scans: [
      {
        statusCode: { type: String },
        status: { type: String },
        dateTime: { type: String },
        location: { type: String },
      },
    ]
  },
  { timestamps: true }
);


export default mongoose.model<OrderDocument>("Order", OrderSchema);