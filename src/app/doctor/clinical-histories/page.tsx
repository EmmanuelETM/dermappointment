import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function ClinicalHistoryPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  return <div>doctor clinical history page</div>;
}
