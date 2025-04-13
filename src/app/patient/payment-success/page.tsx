import { env } from "@/env";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

type SearchParams = Promise<{
  amount: string;
  payment_intent: string;
}>;

export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    (await searchParams).payment_intent,
  );
  const { amount } = await searchParams;

  console.log(paymentIntent.metadata.lockId);

  if (paymentIntent.metadata.lockId == null) return notFound();

  return (
    <main className="rouded-md m-10 mx-auto max-w-6xl border p-10 text-center">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold">Thank you!</h1>
        <h2 className="text-xl">You successfully sent</h2>
        <div className="rounded-md p-2 text-2xl font-bold">${amount}</div>
      </div>
    </main>
  );
}
