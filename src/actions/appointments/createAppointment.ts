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

export async function createAppointment(
  values: z.infer<typeof AppointmentActionSchema>,
) {
  console.log("values from server");
  console.log(values);

  const { success, data } = AppointmentActionSchema.safeParse(values);

  if (!success) {
    return { error: "Invalid Fields!" };
  }

  const startInTimeZone = fromZonedTime(data.startTime, data.timezone);
  const startInDoctorTimeZone = toZonedTime(startInTimeZone, data.timezone);
  const endTime = addMinutes(data.startTime, data.procedure.duration + 15);
  const endIndDoctorTimeZone = toZonedTime(endTime, data.timezone);

  console.log("timezone");
  console.log(data.timezone);

  console.log("start in timezone, and end time");
  console.log(startInTimeZone);
  console.log(endTime);

  console.log("tozoned time start and end");
  console.log(startInDoctorTimeZone);
  console.log(endIndDoctorTimeZone);

  const validTimes = await getValidTimesFromSchedule(
    [startInDoctorTimeZone],
    data.procedure,
    data.doctorId,
    data.location,
  );

  console.log("validTimes");
  console.log(validTimes);

  if (validTimes.length === 0) return { error: "Invalid Schedule Time" };

  const appointments = await getAppointmentTimes({
    doctorId: data.doctorId,
    date: { start: startInDoctorTimeZone, end: endTime },
  });

  if (appointments.length != 0)
    return { error: "This time overlaps with another!" };

  // try {
  //   await db.insert(appointment).values({
  //     userId: data.userId,
  //     doctorId: data.doctorId,
  //     procedureId: data.procedure.id,
  //     startTime: startInTimeZone,
  //     endTime: endTime,
  //     timezone: data.timezone,
  //     location: data.location,
  //     description: data.description,
  //     status: "Pending",
  //   });

  //   revalidatePath("/patients/appointments/new");
  //   return { success: "Appointment Created!" };
  // } catch (error) {
  //   console.log("Error creating appointment: ", error);
  //   return { error: "Something went wrong!" };
  // }
  return { success: "Appointment Created!" };
}
