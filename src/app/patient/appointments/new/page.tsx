import { getDoctorData } from "@/data/doctors";
import { AppointmentTabs } from "./AppointmentTabs";
import { env } from "@/env";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

type SearchParams = Promise<{
  doctor: string;
}>;

const amount = Number(env.APPOINTMENT_BASE_FEE);

export default async function NewAppointmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }
  const doctors = await getDoctorData();
  const doctorId = (await searchParams).doctor;

  const doctor = doctors.find((doctor) => doctor.doctorId === doctorId) ?? null;

  return <AppointmentTabs doctors={doctors} doctor={doctor} amount={amount} />;
}
