"use client";

import React, { type FormEvent, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { convertToSubCurrency } from "@/lib/convertToSubcurrency";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { HashLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { FormError } from "@/components/auth/form-error";

type PaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
};

const CheckoutTab = ({
  amount,
  lockId,
  setCurrentStep,
}: {
  amount: number;
  lockId: string | undefined;
  setCurrentStep: (step: number) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const [formError, setFormError] = useState<string | undefined>("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!lockId) return;

      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: convertToSubCurrency(amount),
          currency: "USD",
          lockId,
        }),
      });

      const json = (await res.json()) as PaymentIntentResponse;
      setClientSecret(json.clientSecret);
    };

    fetchClientSecret().catch((error) => console.log(error));
  }, [amount, lockId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setFormError(submitError.message);
      setLoading(false);
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/patient/payment-success?amount=${amount}&lockId=${lockId}`,
      },
    });

    if (result.error) {
      if (
        result.error.type === "card_error" ||
        result.error.type === "validation_error"
      ) {
        setFormError(result.error.message);
      } else {
        setFormError("An unknown error occurred");
      }
    }

    setLoading(false);
    setDisabled(true);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <HashLoader color={theme.theme === "dark" ? "white" : "black"} />
        Loading
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FormError message={formError} />
      <PaymentElement />
      <div className="flex justify-between pt-2">
        <Button
          disabled={disabled}
          variant="outline"
          onClick={() => setCurrentStep(3)}
        >
          Back
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!stripe || !elements || loading || disabled}
        >
          {!loading ? `Pay $${amount}` : "Processing..."}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutTab;
