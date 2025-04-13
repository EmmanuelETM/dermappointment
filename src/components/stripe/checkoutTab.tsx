"use client";

import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { FormError } from "../auth/form-error";

type PaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
};

const CheckoutTab = ({
  amount,
  onSuccess,
  setCurrentStep,
  setPaymentId,
}: {
  amount: number;
  onSuccess: () => void;
  setCurrentStep: (step: number) => void;
  setPaymentId: (id: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useTheme();
  const [formError, setFormError] = useState<string | undefined>("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [paymentId, setLocalPaymentId] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      const data = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
      });

      const json = (await data.json()) as PaymentIntentResponse;
      setClientSecret(json.clientSecret);
      setLocalPaymentId(json.paymentIntentId);
    };

    fetchClientSecret().catch((error) => console.log(error));
  }, [amount]);

  const handleClick = async () => {
    setLoading(true);
    if (!stripe || !elements) {
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
        return_url: `${env.NEXT_PUBLIC_BASE_URL}/patient/payment-success?amount=${amount}`,
      },
      redirect: "if_required",
    });

    if (result?.error) {
      setFormError(result.error.message);
    } else if (result.paymentIntent?.status === "succeeded") {
      toast("Payment Completed Succesfully!");
      setDisabled(true);
      setPaymentId(paymentId);
      onSuccess();
    }

    setLoading(false);
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
      {clientSecret && <PaymentElement />}
      <div className="flex justify-between pt-2">
        <Button
          disabled={disabled}
          variant="outline"
          onClick={() => setCurrentStep(3)}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleClick}
          disabled={!stripe || loading || disabled}
        >
          {!loading ? `Pay $${amount}` : "Processing..."}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutTab;
