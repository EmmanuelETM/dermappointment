"use server";

import { db } from "@/server/db";
import { appointments, transactions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createRefund } from "@/actions/transactions/refundTransaction";
import { updateAppointmentStatus } from "./updateAppointmentStatus";
import { differenceInHours, isAfter } from "date-fns";

export async function cancelAppointmentWithOptionalRefund(
  appointmentId: string,
) {
  // Buscar la cita
  const appointment = await db.query.appointments.findFirst({
    where: eq(appointments.id, appointmentId),
  });

  if (!appointment) {
    return { error: "Appointment not found" };
  }

  const now = new Date();
  const is24hBefore =
    differenceInHours(new Date(appointment.startTime), now) >= 24;

  if (is24hBefore) {
    const payment = await db.query.transactions.findFirst({
      where: eq(transactions.appointmentId, appointmentId),
    });

    if (!payment) {
      return { error: "Payment not found for this appointment" };
    }

    const refund = await createRefund(
      payment.stripeId,
      "requested_by_customer",
    );

    if (refund?.error) {
      return { error: "Error trying to refund" };
    }

    return {
      success: "Refund requested, appointment will be cancelled shortly",
    };
  }

  await updateAppointmentStatus(appointmentId, "Cancelled");
  return { success: "Appointment cancelled without refund" };
}
