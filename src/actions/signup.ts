"use server";

import { SignUpSchema } from "@/schemas";
import type { z } from "zod";

export const signup = async (values: z.infer<typeof SignUpSchema>) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }

  return { success: "Email Sent" };
};
