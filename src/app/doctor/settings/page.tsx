import { SettingsForm } from "@/components/settings/settings-form";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }
  return (
    <>
      <SettingsForm />
    </>
  );
}
