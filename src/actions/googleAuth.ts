"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/server/auth";

export async function googleSignIn() {
  await signIn("google", {
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
}
