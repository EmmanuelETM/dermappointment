import { Resend } from "resend";
import { sendEmail } from "@/server/nodemailer";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${env.NEXT_PUBLIC_BASE_URL}new-verification?token=${token}`;

  // await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   subject: "Confirm your Email",
  //   html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your email.</p>`,
  // });
  await sendEmail({
    to: email,
    subject: "Confirm you Email",
    html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your email.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${env.NEXT_PUBLIC_BASE_URL}new-password?token=${token}`;
  // await resend.emails.send({
  //   from: "onboarding@resend.dev",
  //   to: email,
  //   subject: "Reset your password",
  //   html: `<p>Click <a href="${resetLink}">Here</a> to reset your password.</p>`,
  // });

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">Here</a> to reset your password.</p>`,
  });
};
