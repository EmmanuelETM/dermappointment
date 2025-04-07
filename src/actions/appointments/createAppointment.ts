"use server";

import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { AppointmentActionSchema } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointment } from "@/server/db/schema";
import { addMinutes } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { getAppointmentTimes } from "./getAppointment";
import { sendConfirmationEmailToDoctor } from "@/lib/mail/appointment";

export async function createAppointment(
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

  const appointments = await getAppointmentTimes({
    doctorId: data.doctor.doctorId,
    date: { start: startInDoctorTimeZone, end: endTime },
  });

  if (appointments.length != 0)
    return { error: "This time overlaps with another!" };

  try {
    const inserted = await db
      .insert(appointment)
      .values({
        userId: data.userId,
        doctorId: data.doctor.doctorId,
        procedureId: data.procedure.id,
        startTime: startInDoctorTimeZone,
        endTime: endInDoctorTimeZone,
        timezone: data.timezone,
        location: data.location,
        description: data.description,
        status: "Pending",
      })
      .returning();

    if (inserted.length > 0) {
      await sendConfirmationEmailToDoctor(data.doctor.email);
    } else {
      return { error: "Email could no be sent to doctor!" };
    }

    revalidatePath("/patients/appointments/new");
    return { success: "Appointment Created!" };
  } catch (error) {
    console.log("Error creating appointment: ", error);
    return { error: "Something went wrong!" };
  }
}
