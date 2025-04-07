import { sendEmail } from "@/server/nodemailer";
import { env } from "@/env";
import { getDoctorTimezone } from "@/data/doctors";
import { format } from "date-fns-tz";
import { subMinutes } from "date-fns";

export const sendConfirmationEmailToDoctor = async (
  doctor: { doctorId: string; doctorEmail: string },
  patient: string,
  procedure: string,
  date: { start: Date; end: Date },
) => {
  const redirect = `${env.NEXT_PUBLIC_BASE_URL}/doctor/appointment-management`;

  const data = await getDoctorTimezone(doctor.doctorId);

  const start = format(date.start, "yyyy/MM/dd hh:mm:a", {
    timeZone: data!.timezone,
  });
  const end = format(subMinutes(date.end, 15), "yyyy/MM/dd hh:mm:a", {
    timeZone: data!.timezone,
  });

  await sendEmail({
    to: doctor.doctorEmail,
    subject: "New Appointment",
    html: `<div><p>${patient} ${procedure} ${start} ${end}</p><p>Click <a href="${redirect}">Here</a> somebody's watching me</p></div>`,
  });
};
