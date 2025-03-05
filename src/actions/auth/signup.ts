"use server";

import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/schemas";
import type { z } from "zod";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { getUserByEmail } from "@/data/user";
import { generateVToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { name, email, password, address, gender } = validatedFields.data;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const existsUser = await getUserByEmail(email);

  if (existsUser) {
    return { error: "Email already in use!" };
  }

  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
    address,
    gender,
    image: "https://robohash.org/69",
  });

  const verificationToken = await generateVToken(email);

  if (verificationToken[0]) {
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token,
    );
  } else {
    return { error: "Failed to generate verification token" };
  }

  return { success: "Confirmation Email Sent!" };
};
