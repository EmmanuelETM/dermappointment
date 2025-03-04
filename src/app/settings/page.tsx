import { auth } from "@/server/auth";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      <h1>{JSON.stringify(session)}</h1>
      <h1>someshit</h1>
    </div>
  );
}
