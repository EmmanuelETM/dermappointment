import { z } from "zod";

export const PaymentSchema = z.object({
  paymentIntentId: z.string(),
  appointmentId: z.string(),
  amount: z.string(),
  currency: z.string(),
  status: z.string(),
});

export type Payment = z.infer<typeof PaymentSchema>;
