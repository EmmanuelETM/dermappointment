"use server";

import { type z } from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { getUserByEmail } from "@/data/user";
import { db } from "@/server/db";
import { passwordResetTokens, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Token does not exist!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid Token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await db
    .update(users)
    .set({
      password: hashedPassword,
    })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(passwordResetTokens)
    .where(eq(passwordResetTokens.identifier, existingToken.identifier));

  return { success: "Password Updated" };
};
