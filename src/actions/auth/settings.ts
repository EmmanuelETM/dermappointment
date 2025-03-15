"use server";

import { type z } from "zod";

import { db } from "@/server/db";
import { type SettingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/currentUser";
import { eq } from "drizzle-orm";
import { users } from "@/server/db/schema";

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
  }

  await db
    .update(users)
    .set({ ...values })
    .where(eq(users.id, dbUser.id));

  return { success: "settings updated" };
};
