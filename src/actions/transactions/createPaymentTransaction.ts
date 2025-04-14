"use server";

import { type Transaction } from "@/schemas/transactions";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function createPaymentTransaction(values: Transaction) {
  const existing = await db.query.transactions.findFirst({
    where: eq(transactions.stripeId, values.stripeId),
  });

  if (!existing) {
    try {
      const transaction = await db
        .insert(transactions)
        .values(values)
        .returning();
      if (transaction.length > 0) {
        console.log("transaction created");
        return { success: "Payment Saved!", transactionId: transaction[0]!.id };
      }
    } catch (error) {
      console.error("DB error creating payment: ", error);
      return { error: "Error saving payment." };
    }
  }

  return { error: "Error saving payment" };
}
