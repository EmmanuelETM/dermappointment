"use server";

import bcrypt from "bcryptjs";
import { SignUpSchema } from "@/schemas";
import type { z } from "zod";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { getUserByEmail } from "@/data/user";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { name, email, password, address, gender } = validatedFields.data;
  const salt = await bcrypt.genSalt(10);
  console.log("Password Cypher: " + password);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashed: " + hashedPassword);

  const existsUser = await getUserByEmail(email);

  console.log(existsUser);

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

  return { success: "Email Sent" };
};
