"use server";

import { type AppointmentActionSchema } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointments } from "@/server/db/schema";
import { revalidatePath } from "next/cache";
import { type z } from "zod";
import { sendConfirmationEmailToDoctor } from "@/lib/mail/appointment";
import { getProcedureById } from "@/data/procedure";
import { getDoctorById } from "@/data/doctors";
import { getUserById } from "@/data/user";

export async function createAppointment(
  values: z.infer<typeof AppointmentActionSchema>,
) {
  console.log("inside createAppointment");
  const procedure = await getProcedureById(values.procedureId);
  const doctor = await getDoctorById(values.doctorId);
  const user = await getUserById(values.userId);

  if (!procedure) {
    return { error: "Procedure not found. Cannot create appointment." };
  }
  if (!doctor) {
    return { error: "Doctor not found. Cannot create appointment." };
  }
  if (!user) {
    return { error: "User not found. Cannot create appointment." };
  }

  let inserted = [];

  try {
    inserted = await db
      .insert(appointments)
      .values({
        userId: values.userId,
        doctorId: values.doctorId,
        procedureId: values.procedureId,
        startTime: values.startTime,
        endTime: values.endTime,
        timezone: values.timezone,
        location: values.location,
        description: values.description,
        status: "Pending",
      })
      .returning({ id: appointments.id });

    if (inserted.length > 0) {
      await sendConfirmationEmailToDoctor(
        { doctorId: values.doctorId, doctorEmail: doctor.users.email! },
        user.name!,
        procedure.name,
        { start: values.startTime, end: values.endTime },
      );
    } else {
      return { error: "Email could no be sent to doctor!" };
    }

    revalidatePath("/patients/appointments/new");
    console.log("Appointment created");
    return { success: "Appointment Created!", appointmentId: inserted[0]?.id };
  } catch (error) {
    console.log("Error creating appointment: ", error);
    return { error: "Something went wrong!" };
  }
}
