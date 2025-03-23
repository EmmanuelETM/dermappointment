"use server";

import { type z } from "zod";
import { ResetSchema } from "@/schemas/auth";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail/index";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (passwordResetToken[0]) {
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token,
    );
  } else {
    return { error: "Failed to generate password reset token!" };
  }

  return { success: "Reset email sent!" };
};
