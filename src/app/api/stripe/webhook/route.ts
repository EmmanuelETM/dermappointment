import { createAppointment } from "@/actions/appointments/createAppointment";
import { createPayment } from "@/actions/payments/createPayment";
import { getAppointmentLockById } from "@/data/appointmentLock";
import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    request.headers.get("stripe-signature")!,
    env.STRIPE_WEBHOOK_SECRET,
  );

  console.log("Inside webhook api");

  if (event.type === "charge.succeeded") {
    console.log("charge succeded");
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

    console.log("creating appointment");

    const appointmentResponse = await createAppointment({
      userId: lockAppointment.userId,
      doctorId: lockAppointment.doctorId,
      procedureId: lockAppointment.procedureId,
      startTime: lockAppointment.startTime,
      endTime: lockAppointment.endTime,
      timezone: lockAppointment.timezone,
      location: lockAppointment.location,
      description: lockAppointment.description ?? "",
      status: "Pending",
    });

    if (appointmentResponse.error) {
      console.log(appointmentResponse.error);
      return new NextResponse("Appointment creation failed", { status: 500 });
    }

    const appointmentId = appointmentResponse?.appointmentId;

    if (appointmentId) {
      console.log("creating payment");
      await createPayment({
        amount,
        currency,
        appointmentId,
        paymentIntentId,
        status,
      });
    }

    return NextResponse.json({ received: true });
  }
  return NextResponse.json({ received: true });
}
