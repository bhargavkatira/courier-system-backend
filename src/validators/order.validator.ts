import { z } from "zod";

export const orderSchema = z.object({
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

  itemQuantity: z.number()
});