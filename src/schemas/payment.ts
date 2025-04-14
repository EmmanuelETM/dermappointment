import { z } from "zod";

export const PaymentSchema = z.object({
  paymentIntentId: z.string(),
  appointmentId: z.string(),
  userId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
});

export type Payment = z.infer<typeof PaymentSchema>;

export const FullPaymentSchema = z.object({
  id: z.string().nullable(),
  user: z.string().nullable(),
  userId: z.string().nullable(),
  doctor: z.string().nullable(),
  doctorId: z.string().nullable(),
  procedure: z.string().nullable(),
  paymentIntentId: z.string().nullable(),
  appointmentId: z.string().nullable(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  status: z.string().nullable(),
});

export type FullPayment = z.infer<typeof FullPaymentSchema>;
