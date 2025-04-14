import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function EditDoctor() {
  const user = await currentUser();

  if (!user || !user.isAdmin) {
    redirect("/login");
  }
  return <div>Edit doctor page</div>;
}
