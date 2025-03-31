import { getDoctorData } from "@/data/doctors";
import { AppointmentTabs } from "./AppointmentTabs";

export default async function AppointmentsPage() {
  const doctors = await getDoctorData();

  return <AppointmentTabs doctors={doctors} />;
}
