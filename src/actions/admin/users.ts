"use server";

import bcrypt from "bcryptjs";
import { UsersFormSchema } from "@/schemas/user";
import type { z } from "zod";
import { db } from "@/server/db";
import { doctors, users } from "@/server/db/schema";
import { getUserByEmail } from "@/data/user";
import { generateVToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail/verification";
import { revalidatePath } from "next/cache";

export async function createUser(values: z.infer<typeof UsersFormSchema>) {
  const validatedFields = UsersFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, email, password, role, location, gender } =
    validatedFields.data;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existsUser = await getUserByEmail(email);

  if (existsUser) {
    return { error: "Email already in use!" };
  }

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
      location,
      gender,
      image: "https://robohash.org/69",
    })
    .returning();

  if (role === "DOCTOR") {
    await db.insert(doctors).values({ userId: user!.id });
  }

  const verificationToken = await generateVToken(user!.id, email);
  console.log(verificationToken[0]);

  if (verificationToken[0]) {
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token,
    );
  } else {
    return { error: "Failed to generate verification token" };
  }

  revalidatePath("/admin/users");
  return { success: "Confirmation Email Sent!" };
}
