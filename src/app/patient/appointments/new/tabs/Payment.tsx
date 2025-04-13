"use client";

import { env } from "@/env";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { convertToSubCurrency } from "@/lib/convertToSubcurrency";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

import CheckoutTab from "@/components/stripe/checkoutTab";

export function PaymentTab({
  onSuccessAction,
  setCurrentStepAction,
  setPaymentIdAction,
  amount,
}: {
  onSuccessAction: () => void;
  setCurrentStepAction: (step: number) => void;
  setPaymentIdAction: (id: string) => void;
  amount: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dermappointment</CardTitle>
        <CardDescription>has Requested ${amount}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubCurrency(amount), //cents
            currency: "usd",
          }}
        >
          <CheckoutTab
            amount={amount}
            onSuccess={onSuccessAction}
            setCurrentStep={setCurrentStepAction}
            setPaymentId={setPaymentIdAction}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
