import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  return <div>Doctor home page</div>;
}
