import { z } from "zod";

export const orderSchema = z.object({
  userId: z.string(),
  status: z.string(),

  customerCode: z.string().min(1),

  declaredValue: z.number().positive(),
  itemDescription: z.string().min(1),
  collectableValue: z.number().optional(),

  height: z.number().optional(),
  length: z.number().optional(),
  breadth: z.number().optional(),
  weight: z.number().optional(),
  pieces: z.number().optional(),

  serviceType: z.string(),
  payMode: z.string(),

  rtnName: z.string(),
  rtnMobile: z.number(),
  rtnAddress: z.string(),
  rtnCity: z.string(),
  rtnState: z.string(),
  rtnPincode: z.number(),

  consName: z.string(),
  consMobile: z.number(),
  consAddress: z.string(),
  consCity: z.string(),
  consState: z.string(),
  consPincode: z.number(),

  invoiceNumber: z.string(),
  invoiceDate: z.string(),
  invoiceValue: z.number(),

  // 👇 ADD THESE
  shprName: z.string().optional(),
  shprAddress: z.string().optional(),
  shprAddressType: z.string().optional(),
  shprCity: z.string().optional(),
  shprState: z.string().optional(),
  shprPincode: z.number().optional(),
  shprMobile: z.number().optional(),
  rtnCountry: z.string().optional(),
  consAddressType: z.string().optional(),

  itemQuantity: z.number()
});


export const orderParamsSchema = z.object({
  id: z.string().min(1, "ID is required"),
});