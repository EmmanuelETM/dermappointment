import { TRANSACTION_TYPE } from "@/data/constants";
import { z } from "zod";

export const TransactionSchema = z.object({
  stripeId: z.string(),
  appointmentId: z.string(),
  type: z.enum(TRANSACTION_TYPE),
  userId: z.string(),
  amount: z.number(),
  currency: z.string(),
  status: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

export const FullTransactionSchema = z.object({
  id: z.string().nullable(),
  user: z.string().nullable(),
  userId: z.string().nullable(),
  doctor: z.string().nullable(),
  doctorId: z.string().nullable(),
  procedure: z.string().nullable(),
  stripeId: z.string().nullable(),
  appointmentId: z.string().nullable(),
  type: z.enum(TRANSACTION_TYPE),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  status: z.string().nullable(),
});

export type FullTransaction = z.infer<typeof FullTransactionSchema>;
