import { currentUser } from "@/lib/currentUser";
import { Calendar } from "./Calendar";
import { redirect } from "next/navigation";
import { getAppointmentsData } from "@/data/appointments";

export default async function CalendarPage() {
  const doctor = await currentUser();

  if (!doctor || !doctor.doctorId) {
    redirect("/login");
  }

  const data = await getAppointmentsData("doctorId", doctor.doctorId);

  console.log(data);

  return <Calendar appointments={data} />;
}
