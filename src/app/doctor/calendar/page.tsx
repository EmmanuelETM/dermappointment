import { getAppointmentsData } from "@/data/appointments";
import { Calendar } from "./Calendar";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

export default async function CalendarPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  const appointments = await getAppointmentsData("doctorId", user.doctorId);

  return (
    <div className="max-h-[80vh] overflow-hidden rounded-lg">
      <div className="mb-6 flex items-center justify-start gap-4">
        <h1 className="py-2 text-2xl font-semibold text-gray-900 dark:text-white lg:text-3xl">
          Calendar
        </h1>
        <Button className="flex items-center space-x-2" variant="outline">
          <CalendarPlus />
          <span>New</span>
        </Button>
      </div>
      <div className="h-full overflow-auto rounded-xl border-2">
        <Calendar appointments={appointments} />
      </div>
    </div>
  );
}
