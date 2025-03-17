"use server";

import { signIn } from "@/server/auth";

export async function googleSignIn(callbackUrl?: string | null) {
  await signIn("google", {
    redirectTo: `/redirect?callbackUrl=${callbackUrl}`,
  });
}
