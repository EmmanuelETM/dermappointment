"use server";

import { env } from "@/env";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function createRefund(
  paymentIntentId: string,
  reason?: Stripe.RefundCreateParams.Reason,
) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: reason,
    });

    revalidatePath("/patient/appointments");
    revalidatePath("/doctor/appointment-management");
    return { success: "Refund Created", refund };
  } catch (error) {
    console.error("Stripe refund error:", error);
    return { error: "Error trying to refund" };
  }
}
