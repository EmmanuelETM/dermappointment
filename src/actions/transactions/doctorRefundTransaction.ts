"use server";

import { env } from "@/env";
import { db } from "@/server/db";
import { transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createRefund(appointmentId: string) {
  const transaction = await db.query.transactions.findFirst({
    where: eq(transactions.appointmentId, appointmentId),
  });

  if (!transaction) {
    return { error: "Could not cancel Appointment!" };
  }

  const paymentIntentId = transaction?.stripeId;

  try {
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: "requested_by_customer",
    });

    revalidatePath("/patient/appointments");
    revalidatePath("/doctor/appointment-management");
    return { success: "Appointment Cancelled" };
  } catch (error) {
    console.error("Stripe refund error:", error);
    return { error: "Error trying to Cancel" };
  }
}
