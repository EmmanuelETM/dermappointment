import { sendEmail } from "@/server/nodemailer";
import { env } from "@/env";

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${env.NEXT_PUBLIC_BASE_URL}new-verification?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Confirm you Email",
    html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${env.NEXT_PUBLIC_BASE_URL}new-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">Here</a> to reset your password.</p>`,
  });
};
