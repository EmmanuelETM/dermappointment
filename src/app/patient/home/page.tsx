import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }
  return <div>Patient home page</div>;
}
