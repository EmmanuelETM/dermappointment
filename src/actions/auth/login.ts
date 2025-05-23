"use server";

import { LoginSchema } from "@/schemas/auth";
import type { z } from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/server/auth";
import { getDefaultRedirect } from "@/routes";
import { generateVToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail/verification";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) return { error: "Invalid Credentials!" };
  if (!existingUser.email) return { error: "Email does not exist!" };
  if (!existingUser.password) return { error: "Incorrect Password!" };

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) return { error: "Invalid Credentials!" };

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVToken(
      existingUser.id,
      existingUser.email,
    );

    if (verificationToken[0]) {
      await sendVerificationEmail(
        verificationToken[0].email,
        verificationToken[0].token,
      );
    } else {
      return { error: "Failed to generate verification token" };
    }

    return { success: "Confirmation Email sent!" };
  }

  const redirectUrl = getDefaultRedirect(existingUser.role as string);

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl ?? redirectUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
