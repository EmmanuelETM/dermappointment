"use client";

import { PaymentSettings } from "./payment-settings";
import { UserSettings } from "./user-settings";

export function SettingsForm() {
  return (
    <>
      <UserSettings />
      <PaymentSettings />
    </>
  );
}
