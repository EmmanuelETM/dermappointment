import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

import Stripe from "stripe";
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type RequestParams = {
  amount: number;
  currency: string;
  lockId: string;
};

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, lockId } =
      (await request.json()) as RequestParams;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: { lockId },
      automatic_payment_methods: { enabled: true },
    });

    if (paymentIntent.client_secret == null) {
      return NextResponse.json(
        { error: "Something went Wrong!" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error: ${String(error)}` },
      { status: 500 },
    );
  }
}
