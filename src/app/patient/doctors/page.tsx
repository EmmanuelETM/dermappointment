import { getDoctorData } from "@/data/doctors";

export default async function DoctorPage() {
  const data = await getDoctorData();
  console.log(data);
  return <div>Search Doctor page</div>;
}
