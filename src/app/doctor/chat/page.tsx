import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  return <div>doctor chat page</div>;
}
