import { getAppointmentById } from "@/data/appointments";
import { redirect } from "next/navigation";
import { CancelAppointment } from "./CancelAppointment";
import { toast } from "sonner";
import { currentUser } from "@/lib/currentUser";

type SearchParams = Promise<{
  appointment: string;
}>;

export default async function CancelAppointmentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }

  const appointmentId = (await searchParams).appointment;

  if (!appointmentId) {
    redirect("/patient/home");
  }

  const appointment = await getAppointmentById(appointmentId);

  if (!appointment) {
    toast("Something went wrong!");
    redirect("/patient/appointments");
  }

  return <CancelAppointment appointment={appointment} />;
}
