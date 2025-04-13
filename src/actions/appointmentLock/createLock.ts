"use server";

import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { AppointmentActionSchema } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointmentLock, appointments } from "@/server/db/schema";
import { addMinutes } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { getAppointmentTimes } from "@/lib/getAppointmentTimes";
import { sendConfirmationEmailToDoctor } from "@/lib/mail/appointment";

export async function createLock(
  values: z.infer<typeof AppointmentActionSchema>,
) {
  const { success, data } = AppointmentActionSchema.safeParse(values);

  if (!success) {
    return { error: "Invalid Fields!" };
  }

  const startInTimeZone = fromZonedTime(data.startTime, data.timezone);
  const startInDoctorTimeZone = toZonedTime(startInTimeZone, data.timezone);

  const endTime = addMinutes(startInTimeZone, data.procedure.duration + 15);
  const endInDoctorTimeZone = toZonedTime(endTime, data.timezone);

  const validTimes = await getValidTimesFromSchedule(
    [startInDoctorTimeZone],
    data.procedure,
    data.doctor.doctorId,
    data.location,
  );

  if (validTimes.length === 0) return { error: "Invalid Schedule Time" };

  const appointmentTimes = await getAppointmentTimes({
    doctorId: data.doctor.doctorId,
    date: { start: startInDoctorTimeZone, end: endTime },
  });

  if (appointmentTimes.length != 0)
    return { error: "This time overlaps with another!" };

  const expires = "";

  try {
    // await db
    //   .insert(appointmentLock)
    //   .values({
    //     userId: data.userId,
    //     doctorId: data.doctor.doctorId,
    //     procedureId: data.procedure.id,
    //     startTime: startInDoctorTimeZone,
    //     endTime: endInDoctorTimeZone,
    //     timezone: data.timezone,
    //     location: data.location,
    //     description: data.description,

    //   })
    //   .returning({ id: appointments.id });

    revalidatePath("/patients/appointments/new");
    return { success: "Appointment Lock Created Successfully!", LockId: "" };
  } catch (error) {
    console.log("Error creating appointment: ", error);
    return { error: "Something went wrong!", LockId: "" };
  }
}
