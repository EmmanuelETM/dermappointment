"use server";

import { type Payment } from "@/schemas/payment";
import { db } from "@/server/db";
import { payments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function createPayment(values: Payment) {
  const existing = await db.query.payments.findFirst({
    where: eq(payments.paymentIntentId, values.paymentIntentId),
  });
  console.log("inside createPayment");
  if (!existing) {
    try {
      const payment = await db.insert(payments).values(values).returning();

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
