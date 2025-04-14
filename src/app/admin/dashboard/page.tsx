import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await currentUser();

  if (!user || !user.isAdmin) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
}
