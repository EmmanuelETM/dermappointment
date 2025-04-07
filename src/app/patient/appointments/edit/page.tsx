import { getSingleAppointment } from "@/data/appointments";
import { redirect } from "next/navigation";
import { EditAppointment } from "./EditAppointment";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
type SearchParams = Promise<{
  appointment: string;
}>;

export default async function EditAppointmentPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const appointmentId = (await searchParams).appointment;

  if (!appointmentId) {
    redirect("/patient/home");
  }

  const appointment = await getSingleAppointment(appointmentId);

  if (!appointment) {
    toast("Something went wrong!");
    redirect("/patient/appointments");
  }

  return <EditAppointment appointment={appointment} />;
}
