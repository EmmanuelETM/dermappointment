import { v4 as uuidv4 } from "uuid";
import { getVTokenByEmail } from "./verificationToken";
import { db } from "@/server/db";
import { verificationTokens } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const generateVToken = async (email: string) => {
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
    .values({ email, token, expires })
    .returning();

  return verificationToken;
};
