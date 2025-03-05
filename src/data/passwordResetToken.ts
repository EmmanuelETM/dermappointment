import { db } from "@/server/db";
import { passwordResetToken } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.token, token),
    });

    return passwordToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordToken = await db.query.passwordResetToken.findFirst({
      where: eq(passwordResetToken.email, email),
    });
    return passwordToken;
  } catch {
    return null;
  }
};
