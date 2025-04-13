import { env } from "@/env";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import AppointmentInfo from "./AppointmentInfo";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<{
  payment_intent: string;
}>;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    (await searchParams).payment_intent,
  );
  const amount = paymentIntent.amount;

  if (!paymentIntent.metadata.lockId) notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <AppointmentInfo
      lockId={paymentIntent.metadata.lockId}
      amount={amount}
      isSuccess={isSuccess}
    />
  );
}
