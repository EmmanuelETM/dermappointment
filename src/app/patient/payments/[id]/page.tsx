import { AppointmentSummaryCard } from "@/components/AppointmentSummaryCard";
import { getAppointmentById } from "@/data/appointments";
import { getPaymentById } from "@/data/payments";
import { currentUser } from "@/lib/currentUser";
import { FullAppointment } from "@/schemas/appointment";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();
  const { id } = await params;

  if (!user || !user.id) {
    redirect("/login");
  }

  const payment = await getPaymentById(id);

  if (!payment?.appointmentId && !payment?.amount) {
    return <div>Payment not found</div>;
  }

  const appointment = await getAppointmentById(payment?.appointmentId);

  if (!appointment) {
    return <div>Appointment not found</div>;
  }

  return (
    <>
      <AppointmentSummaryCard
        title={"Receipt"}
        description={"this is a receipt"}
        amount={payment.amount}
        data={appointment}
      />
    </>
  );
}
