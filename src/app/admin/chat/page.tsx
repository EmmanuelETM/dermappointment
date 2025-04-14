import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function AdminChatPage() {
  const user = await currentUser();

  if (!user || !user.isAdmin) {
    redirect("/login");
  }

  return <div>admin chat page</div>;
}
