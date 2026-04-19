import { z } from "zod";

export const trackingParamsSchema = z.object({
  awb: z
    .string()
    .min(1, "AWB is required")
    .regex(/^\d+$/, "AWB must be numeric"),
});