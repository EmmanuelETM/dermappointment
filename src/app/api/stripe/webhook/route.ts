import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { buffer } from "@/lib/buffer";
import { createPayment } from "@/actions/payments/createPayment";
import { env } from "@/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    // event = stripe.webhooks.constructEvent(
    //   body, sig,
    // )
  } catch (error) {}

  return;
}
