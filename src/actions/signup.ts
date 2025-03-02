"use server";

import bcrypt from "bcrypt";
import { SignUpSchema } from "@/schemas";
import type { z } from "zod";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  const { name, email, password, address, gender } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existsUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  console.log(existsUser);

  if (existsUser.length) {
    return { error: "Email already in use!" };
  }

  // name: z.string().min(1, {
  //   message: "First name is required",
  // }),
  // email: z.string().email({
  //   message: "Invalid Email",
  // }),
  // password: z.string().min(8, {
  //   message: "Minimum of 8 characters required",
  // }),
  // confirm: z.string().min(8, {
  //   message: "Minimum of 8 characters required",
  // }),
  // birthday: z.string().date("Birth Date is required"),
  // address: z.string(),
  // phone: z.string().min(10, {
  //   message: "Enter a correct phone number",
  // }),
  // gender: z.string(),

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
