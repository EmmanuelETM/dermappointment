import { sendEmail } from "@/server/nodemailer";
import { env } from "@/env";
import { getDoctorEmailById, getDoctorTimezone } from "@/data/doctors";
import { format } from "date-fns-tz";
import { subMinutes } from "date-fns";
import { getAppointmentById } from "@/data/appointments";

export const sendConfirmationEmailToDoctor = async (
  doctorId: string,
  appointmentId: string,
) => {
  const redirect = `${env.NEXT_PUBLIC_BASE_URL}/doctor/appointment-management`;

  const data = await getDoctorTimezone(doctorId);
  const doctorEmail = await getDoctorEmailById(doctorId);
  const appointment = await getAppointmentById(appointmentId);

  if (!doctorEmail.email) {
    throw new Error("Doctor email not found");
  }

  const start = format(appointment!.startTime, "yyyy/MM/dd hh:mm:a", {
    timeZone: data!.timezone,
  });
  const end = format(
    subMinutes(appointment!.endTime, 15),
    "yyyy/MM/dd hh:mm:a",
    {
      timeZone: data!.timezone,
    },
  );

  await sendEmail({
    to: doctorEmail.email,
    subject: "New Appointment",
    html: `<div><p>${appointment?.patients.name} ${appointment?.procedures.name} ${start} ${end}</p><p>Click <a href="${redirect}">Here</a> somebody's watching me</p></div>`,
  });
};
