import { env } from "@/env";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";
import AppointmentInfo from "./AppointmentInfo";
import { currentUser } from "@/lib/currentUser";

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
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }
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
