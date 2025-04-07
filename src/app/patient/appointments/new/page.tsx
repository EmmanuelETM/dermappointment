import { getDoctorData } from "@/data/doctors";
import { AppointmentTabs } from "./AppointmentTabs";

export default async function NewAppointmentsPage({
  searchParams,
}: {
  searchParams: { doctor?: string };
}) {
  const doctors = await getDoctorData();
  const doctorId = searchParams.doctor;

  const doctor = doctors.find((doctor) => doctor.doctorId === doctorId) ?? null;

  return <AppointmentTabs doctors={doctors} doctor={doctor} />;
}
