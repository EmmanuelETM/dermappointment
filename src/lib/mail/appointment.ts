import { sendEmail } from "@/server/nodemailer";
import { env } from "@/env";

export const sendConfirmationEmailToDoctor = async (email: string) => {
  const redirect = `${env.NEXT_PUBLIC_BASE_URL}/doctor/appointment-management`;
  await sendEmail({
    to: email,
    subject: "New Appointment",
    html: `<p>Click <a href="${redirect}">Here</a> somebody's watching me</p>`,
  });
};
