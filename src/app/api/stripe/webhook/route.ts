import { createAppointment } from "@/actions/appointments/createAppointment";
import { updateAppointmentStatus } from "@/actions/appointments/updateAppointmentStatus";
import { createPaymentTransaction } from "@/actions/transactions/createPaymentTransaction";
import { getAppointmentLockById } from "@/data/appointmentLock";
import { env } from "@/env";
import { sendConfirmationEmailToDoctor } from "@/lib/mail/appointment";
import { db } from "@/server/db";
import {
  appointmentLock,
  appointments,
  transactions,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

    const existingAppointment = await db.query.appointments.findFirst({
      where: eq(appointments.lockId, lockId),
    });

    if (existingAppointment) {
      console.log("Appointment already exists for lockId:", lockId);

      const existingPayment = await db.query.transactions.findFirst({
        where: eq(transactions.stripeId, paymentIntentId),
      });

      if (!existingPayment) {
        console.log("Creando pago para cita existente...");
        await createPaymentTransaction({
          amount,
          currency,
          appointmentId: existingAppointment.id,
          stripeId: paymentIntentId,
          userId: lockAppointment.userId,
          type: "Payment",
          status,
        });
      } else {
        console.log("Pago ya existente.");
      }

      console.log("Enviando correo (cita ya existía)...");
      await sendConfirmationEmailToDoctor(
        lockAppointment.doctorId,
        existingAppointment.id,
      );

      return new NextResponse(
        "Appointment already existed. Payment and email handled.",
        { status: 200 },
      );
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
      await createPaymentTransaction({
        amount,
        currency,
        appointmentId,
        stripeId: paymentIntentId,
        userId: lockAppointment.userId,
        type: "Payment",
        status,
      });

      console.log("Eliminando lock...");
      await db.delete(appointmentLock).where(eq(appointmentLock.id, lockId));

      console.log("Enviando correo...");
      await sendConfirmationEmailToDoctor(
        lockAppointment.doctorId,
        appointmentId,
      );

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Error en la creación o notificación:", error);
      return new NextResponse("Something went wrong", { status: 500 });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const paymentIntentId = charge.payment_intent as string;
    const amountRefunded = charge.amount_refunded;
    const currency = charge.currency;
    const status = charge.status;

    try {
      console.log("inside checking transactions");
      const originalTransaction = await db.query.transactions.findFirst({
        where: eq(transactions.stripeId, paymentIntentId),
      });

      if (!originalTransaction) {
        console.warn("Original Transaction not Found.");
        return new NextResponse("Original transaction not found", {
          status: 404,
        });
      }

      await db
        .update(transactions)
        .set({
          amount: amountRefunded,
          currency: currency,
          type: "Refund",
          status: status,
        })
        .where(
          eq(transactions.appointmentId, originalTransaction.appointmentId),
        );

      await updateAppointmentStatus(
        originalTransaction.appointmentId,
        "Cancelled",
      );

      console.log("Refund successful.");
      revalidatePath("/doctor/appointment-management");
      revalidatePath("/patient/appointments");
    } catch (error) {
      console.error("Error trying to process:", error);
      return new NextResponse("Refund processing error", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
