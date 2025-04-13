"use server";

import { EditAppointmentActionSchema } from "@/schemas/appointment";
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { addMinutes } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { db } from "@/server/db";
import { appointments } from "@/server/db/schema";
import { type z } from "zod";
import { getAppointmentTimes } from "@/lib/getAppointmentTimes";
import { eq } from "drizzle-orm";
import { getSingleAppointment } from "@/data/appointments";

export async function editAppointment(
  values: z.infer<typeof EditAppointmentActionSchema>,
) {
  const validatedFields = EditAppointmentActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid field data!" };
  }

  const { data } = validatedFields;

  const startInTimeZone = fromZonedTime(data.startTime, data.timezone);
  const startInDoctorTimeZone = toZonedTime(startInTimeZone, data.timezone);

  const endTime = addMinutes(startInTimeZone, data.procedure.duration + 15);
  const endInDoctorTimeZone = toZonedTime(endTime, data.timezone);

  const existingAppointment = await getSingleAppointment(data.appointmentId);

  const timeTolerance = 1000;
  const isSameTime =
    Math.abs(
      existingAppointment!.startTime.getTime() -
        startInDoctorTimeZone.getTime(),
    ) <= timeTolerance &&
    Math.abs(
      existingAppointment!.endTime.getTime() - endInDoctorTimeZone.getTime(),
    ) <= timeTolerance;

  if (isSameTime) {
    try {
      await db
        .update(appointments)
        .set({
          description: data.description,
        })
        .where(eq(appointments.id, data.appointmentId));

      return { success: "Appointment Updated!" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong!" };
    }
  } else {
    const validTimes = await getValidTimesFromSchedule(
      [startInDoctorTimeZone],
      data.procedure,
      data.doctorId,
      data.location,
    );

    if (validTimes.length === 0) return { error: "Invalid Schedule Time" };

    const appointmentTimes = await getAppointmentTimes({
      doctorId: data.doctorId,
      date: { start: startInDoctorTimeZone, end: endTime },
    });

    if (appointmentTimes.length != 0)
      return { error: "This time overlaps with another!" };

    try {
      await db
        .update(appointments)
        .set({
          startTime: startInDoctorTimeZone,
          endTime: endInDoctorTimeZone,
          timezone: data.timezone,
          location: data.location,
          description: data.description,
          status: "Pending",
        })
        .where(eq(appointments.id, data.appointmentId));

      return { success: "Appointment Updated!" };
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong!" };
    }
  }
}
