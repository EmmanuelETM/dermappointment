import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return <div>{user.doctorId}</div>;
}
