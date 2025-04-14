"use server";

import { type Transaction } from "@/schemas/transactions";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function createTransaction(values: Transaction) {
  const existing = await db.query.transactions.findFirst({
    where: eq(transactions.stripeId, values.stripeId),
  });
  console.log("inside createTransaction");
  if (!existing) {
    try {
      const payment = await db.insert(transactions).values(values).returning();

      if (payment.length > 0) {
        console.log("payment created");
        return { success: "Payment Saved!", paymentId: payment[0]!.id };
      }
    } catch (error) {
      console.error("DB error creating payment: ", error);
      return { error: "Error saving payment." };
    }
  }

  return { error: "Error saving payment" };
}
