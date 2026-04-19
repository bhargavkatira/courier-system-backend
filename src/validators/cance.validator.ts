import { z } from "zod";

export const cancelOrderSchema = z.object({
  awb: z
    .string()
    .min(1, "AWB is required")
    .regex(/^\d+$/, "AWB must be numeric"),
});

 // 🔥 Type inference (optional but useful)
// export type CancelOrderDTO = z.infer<typeof cancelOrderSchema>;