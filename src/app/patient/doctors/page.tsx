import { getFullDoctor } from "@/data/doctors";

export default async function DoctorPage() {
  const data = await getFullDoctor();
  console.log(data);
  return <div>Search Doctor page</div>;
}
