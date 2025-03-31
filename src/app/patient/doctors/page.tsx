import { getDoctorData } from "@/data/doctors";

export default async function DoctorPage() {
  const data = await getDoctorData();
  return <div>Patients Doctor Page</div>;
}
