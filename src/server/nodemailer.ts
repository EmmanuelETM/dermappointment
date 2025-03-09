import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { google } from "googleapis";
import { env } from "@/env";

const OAuth2Client = new google.auth.OAuth2(
  env.AUTH_GOOGLE_CLIENT_ID,
  env.AUTH_GOOGLE_CLIENT_SECRET,
  env.AUTH_GOOGLE_REDIRECT_URI,
);

OAuth2Client.setCredentials({ refresh_token: env.AUTH_GOOGLE_REFRESH_TOKEN });

const getAccessToken = async () => {
  try {
    const { token } = await OAuth2Client.getAccessToken();
    return token;
  } catch (error) {
    throw new Error(
      "Failed to retrieve access token: " + (error as Error).message,
    );
  }
};

const createTransporter = async () => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error("Failed to retrieve access token");
  }

  const transportOptions: SMTPTransport.Options = {
    host: "smtp.gmail.com",
    port: 465, // Usa 587 si quieres STARTTLS
    secure: true, // true para 465, false para 587
    auth: {
      type: "OAuth2",
      user: env.NODEMAILER_EMAIL,
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
      refreshToken: env.AUTH_GOOGLE_REFRESH_TOKEN,
      accessToken,
    },
  };

  return nodemailer.createTransport(transportOptions);
};

type sendEmailProps = {
  to: string | string[];
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: sendEmailProps) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: '"DermAppointment" <noreply@DermAppointment.info>',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Fail to send email: ", (error as Error).message);
  }
};
