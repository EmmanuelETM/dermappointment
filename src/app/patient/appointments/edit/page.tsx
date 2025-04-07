import { getSingleAppointment } from "@/data/appointments";
import { redirect } from "next/navigation";
import { EditAppointment } from "./EditAppointment";
import { toast } from "sonner";

export default async function EditAppointmentPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const appointmentId = searchParams.appointment;

  if (!appointmentId) {
    redirect("/patient/home");
  }

  const appointment = await getSingleAppointment(appointmentId as string);

  if (!appointment) {
    toast("Something went wrong!");
    redirect("/patient/appointments");
  }

  return <EditAppointment appointment={appointment} />;
}
