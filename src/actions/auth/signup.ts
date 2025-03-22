"use server";

import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/schemas";
import type { z } from "zod";
import { db } from "@/server/db";
import { patients, users } from "@/server/db/schema";
import { getUserByEmail } from "@/data/user";
import { generateVToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail/index";
import { type LOCATION } from "@/data/constants";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { name, email, password, location, gender } = validatedFields.data;
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
      location: location as (typeof LOCATION)[number],
      gender,
      image: "https://robohash.org/69",
    })
    .returning();

  await db.insert(patients).values({ userId: user!.id });

  const verificationToken = await generateVToken(user!.id, email);
  console.log(verificationToken[0]);

  // const callbackUrl = "";

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
