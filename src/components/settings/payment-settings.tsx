"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PaymentSettings = () => {
  return (
    <Card className="w-full">
      <CardHeader className="center flex flex-row justify-between">
        <CardTitle>Payment Settings</CardTitle>
      </CardHeader>
      <CardContent>Paypal</CardContent>
    </Card>
  );
};
