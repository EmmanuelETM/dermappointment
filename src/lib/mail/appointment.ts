import { sendEmail } from "@/server/nodemailer";
import { env } from "@/env";

export const sendConfirmationEmailToDoctor = async (
  email: string,
  token: string,
) => {
  const confirmLink = `${env.NEXT_PUBLIC_BASE_URL}new-verification?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Confirm your Email",
    html: `<p>Click <a href="${confirmLink}">Here</a> to confirm your email.</p>`,
  });
};
