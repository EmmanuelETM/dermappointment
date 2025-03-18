import { v4 as uuidv4 } from "uuid";
import { getVTokenByEmail } from "@/data/verificationToken";
import { db } from "@/server/db";
import { passwordResetTokens, verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const generateVToken = async (userId: string, email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, existingToken.identifier));
  }

  const verificationToken = await db
    .insert(verificationTokens)
    .values({ userId, email, token, expires })
    .returning();

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVTokenByEmail(email);

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.identifier, existingToken.identifier));
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({ email, token, expires })
    .returning();

  return passwordResetToken;
};
