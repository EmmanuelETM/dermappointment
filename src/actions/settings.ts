"use server";

import { type z } from "zod";

import { db } from "@/server/db";
import { type SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
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

  await db
    .update(users)
    .set({ ...values })
    .where(eq(users.id, dbUser.id));

  return { success: "settings updated" };
};
