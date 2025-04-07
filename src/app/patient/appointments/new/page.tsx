import { getDoctorData } from "@/data/doctors";
import { AppointmentTabs } from "./AppointmentTabs";

type SearchParams = Promise<{
  doctor: string;
}>;

export default async function NewAppointmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const doctors = await getDoctorData();
  const doctorId = (await searchParams).doctor;

  const doctor = doctors.find((doctor) => doctor.doctorId === doctorId) ?? null;

  return <AppointmentTabs doctors={doctors} doctor={doctor} />;
}
