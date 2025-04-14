"use server";

import { type AppointmentActionSchema } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointments } from "@/server/db/schema";
import { type z } from "zod";
export async function createAppointment(
  values: z.infer<typeof AppointmentActionSchema>,
) {
  console.log("inside createAppointment");

  let inserted = [];

  try {
    inserted = await db
      .insert(appointments)
      .values({
        userId: values.userId,
        doctorId: values.doctorId,
        procedureId: values.procedureId,
        lockId: values.lockId,
        startTime: values.startTime,
        endTime: values.endTime,
        timezone: values.timezone,
        location: values.location,
        description: values.description,
        status: "Pending",
      })
      .returning({ id: appointments.id });

    console.log("Appointment created");
    return { success: "Appointment Created!", appointmentId: inserted[0]?.id };
  } catch (error) {
    console.log("Error creating appointment: ", error);
    return { error: "Something went wrong!" };
  }
}
