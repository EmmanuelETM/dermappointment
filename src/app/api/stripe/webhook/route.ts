import { createAppointment } from "@/actions/appointments/createAppointment";
import { createPayment } from "@/actions/payments/createPayment";
import { getAppointmentLockById } from "@/data/appointmentLock";
import { env } from "@/env";
import { db } from "@/server/db";
import { appointmentLock } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature")!,
    env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "charge.succeeded") {
    const charge = event.data.object;
    const lockId = charge.metadata.lockId;
    const amount = charge.amount;
    const currency = charge.currency;
    const paymentIntentId = charge.payment_intent as string;
    const status = charge.status;

    if (!lockId) {
      return new NextResponse("Missing lockId", { status: 400 });
    }

    const lockAppointment = await getAppointmentLockById(lockId);

    if (!lockAppointment) {
      return new NextResponse("Lock not found", { status: 400 });
    }

    const appointmentResponse = await createAppointment({
      userId: lockAppointment.userId,
      doctorId: lockAppointment.doctorId,
      procedureId: lockAppointment.procedureId,
      lockId,
      startTime: lockAppointment.startTime,
      endTime: lockAppointment.endTime,
      timezone: lockAppointment.timezone,
      location: lockAppointment.location,
      description: lockAppointment.description ?? "",
      status: "Pending",
    });

    if (appointmentResponse.error) {
      return new NextResponse("Appointment creation failed", { status: 400 });
    }

    const appointmentId = appointmentResponse?.appointmentId;

    if (appointmentId) {
      await createPayment({
        amount,
        currency,
        appointmentId,
        paymentIntentId,
        status,
      });
    }

    await db.delete(appointmentLock).where(eq(appointmentLock.id, lockId));
  }
  return new NextResponse();
}
