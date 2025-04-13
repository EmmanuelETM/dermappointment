import { sendEmail } from "@/server/nodemailer";
import { Email } from "./email/appointment";
import { render } from "@react-email/components";

export const sendTestEmail = async () => {
  const emailHtml = await render(<Email />);

  await sendEmail({
    to: "torresmalenaemmanuel@gmail.com",
    subject: "Confirm your Email",
    html: emailHtml,
  });
};

// export const sendPasswordResetEmail = async (email: string, token: string) => {
//   const resetLink = `${env.NEXT_PUBLIC_BASE_URL}new-password?token=${token}`;

//   await sendEmail({
//     to: email,
//     subject: "Reset your password",
//     html: `<p>Click <a href="${resetLink}">Here</a> to reset your password.</p>`,
//   });
// };
