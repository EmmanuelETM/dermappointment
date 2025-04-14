import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function DoctorPatientsPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  return <div>doctor patients page</div>;
}
