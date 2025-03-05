"use server";

import { db } from "@/server/db";
import { getUserByEmail } from "@/data/user";
import { getVTokenByToken } from "@/data/verificationToken";
import { users, verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
  const existingToken = await getVTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(verificationTokens)
    .where(eq(verificationTokens.identifier, existingToken.identifier));

  return { success: "Email Verified!" };
};
