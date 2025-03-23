"use server";

import { type z } from "zod";

import { db } from "@/server/db";
import bcrypt from "bcryptjs";
import { type SettingsSchema } from "@/schemas/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/currentUser";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";
import { generateVToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id!);

  if (!dbUser) {
    return { error: "Unathorized" };
  }

  if (user.isOauth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }

    if (!user.id) {
      return { error: "Something went wrong!" };
    }

    const verificationToken = await generateVToken(user.id, values.email);

    if (verificationToken[0]) {
      await sendVerificationEmail(
        verificationToken[0].email,
        verificationToken[0].token,
      );

      return { success: "Verification email sent!" };
    }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      return { error: "Invalid current password!" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(values.newPassword, salt);

    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await db
    .update(users)
    .set({ ...values })
    .where(eq(users.id, dbUser.id));

  return { success: "Settings Updated" };
};
