import { SettingsForm } from "@/components/settings/settings-form";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/login");
  }
  return (
    <>
      <SettingsForm />
    </>
  );
}
