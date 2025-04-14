import { createAppointment } from "@/actions/appointments/createAppointment";
import { createPayment } from "@/actions/payments/createPayment";
import { getAppointmentLockById } from "@/data/appointmentLock";
import { env } from "@/env";
import { sendConfirmationEmailToDoctor } from "@/lib/mail/appointment";
import { db } from "@/server/db";
import { appointmentLock } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      request.headers.get("stripe-signature")!,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return new NextResponse("Invalid signature", { status: 400 });
  }

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

    try {
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

      if (appointmentResponse.error || !appointmentResponse.appointmentId) {
        console.error("Error creando la cita:", appointmentResponse.error);
        return new NextResponse("Appointment creation failed", { status: 400 });
      }

      const appointmentId = appointmentResponse.appointmentId;

      console.log("Creando pago...");
      await createPayment({
        amount,
        currency,
        appointmentId,
        paymentIntentId,
        userId: lockAppointment.userId,
        status,
      });

      console.log("Eliminando lock...");
      await db.delete(appointmentLock).where(eq(appointmentLock.id, lockId));

      console.log("Enviando correo...");
      await sendConfirmationEmailToDoctor(
        lockAppointment.doctorId,
        appointmentId,
      );
    } catch (error) {
      console.error("Error en la creación o notificación:", error);
      return new NextResponse("Something went wrong", { status: 500 });
    }
  }

  return new NextResponse("Event received");
}
