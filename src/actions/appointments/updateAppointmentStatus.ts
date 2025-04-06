"use server";

import { type APPOINTMENT_STATUS } from "@/data/constants";
import { db } from "@/server/db";
import { appointment } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(
  appointmentId: string,
  status: (typeof APPOINTMENT_STATUS)[number],
) {
  try {
    await db
      .update(appointment)
      .set({
        status: status,
      })
      .where(eq(appointment.id, appointmentId));

    revalidatePath("/doctor/appointment-confirmation");
    return { success: `Appointment ${status} successfully!` };
  } catch (error) {
    console.error(error);
    return { error: "Failed to Update status!" };
  }
}
