import { db } from "@/server/db";
import { verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getVTokenByEmail = async (email: string) => {
  try {
    const vToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.email, email),
    });
    return vToken;
  } catch {
    return null;
  }
};

export const getVTokenByToken = async (token: string) => {
  try {
    const vToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.token, token),
    });
    return vToken;
  } catch {
    return null;
  }
};
