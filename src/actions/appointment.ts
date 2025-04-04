"use server";

import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule";
import { AppointmentActionSchema } from "@/schemas/appointment";
import { getAppointmentScheduleData } from "@/data/appointments";
import { addMinutes, endOfDay, startOfDay } from "date-fns";

import { type z } from "zod";
import { db } from "@/server/db";
import { appointment } from "@/server/db/schema";
import { fromZonedTime } from "date-fns-tz";
// import { appointment } from "@/server/db/schema";

type AppointmentTimesProp = {
  doctorId: string;
  date: {
    start: Date;
    end: Date;
  };
};

export async function getAppointmentTimes({
  doctorId,
  date,
}: AppointmentTimesProp) {
  const appointments = await getAppointmentScheduleData(
    "doctorId",
    doctorId,
    "Confirmed",
    date,
  );

  return appointments
    .map((appointment) => {
      if (!appointment.startTime || !appointment.endTime) return null;

      const isFullDayEvent =
        appointment.startTime.getHours() === 0 &&
        appointment.startTime.getMinutes() === 0 &&
        appointment.endTime.getHours() === 23 &&
        appointment.endTime.getMinutes() === 59;

      return {
        start: isFullDayEvent
          ? startOfDay(appointment.startTime)
          : new Date(appointment.startTime),
        end: isFullDayEvent
          ? endOfDay(appointment.endTime)
          : new Date(appointment.endTime),
      };
    })
    .filter((item): item is { start: Date; end: Date } => item !== null);
}

export async function createAppointment(
  values: z.infer<typeof AppointmentActionSchema>,
) {
  console.log(values.startTime);
  const { success, data } = AppointmentActionSchema.safeParse(values);

  if (!success) {
    return { error: "Invalid Fields!" };
  }

  const startInTimeZone = fromZonedTime(data.startTime, data.timezone);

  console.log(startInTimeZone);

  const validTimes = await getValidTimesFromSchedule(
    [startInTimeZone],
    data.procedure,
    data.doctorId,
    data.location,
  );

  console.log([data.startTime]);

  if (validTimes.length === 0) return { error: "Invalid Schedule Time" };

  try {
    await db.insert(appointment).values({
      userId: data.userId,
      doctorId: data.doctorId,
      procedureId: data.procedure.id,
      startTime: data.startTime,
      endTime: addMinutes(data.startTime, data.procedure.duration),
      timezone: data.timezone,
      location: data.location,
      description: data.description,
      status: "Pending",
    });

    return { success: "Appointment Created!" };
  } catch (error) {
    console.log("Error creating appointment: ", error);
    return { error: "Something went wrong!" };
  }

  return;
}
