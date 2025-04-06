import { getAppointmentsData } from "@/data/appointments";
import { Calendar } from "./Calendar";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const appointments = await getAppointmentsData("userId", user.id, "Pending");

  return (
    <div className="max-h-[80vh] overflow-hidden rounded-lg">
      <div className="h-full overflow-auto border-2">
        <Calendar appointments={appointments} />
      </div>
    </div>
  );
}
