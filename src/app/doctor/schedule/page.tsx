import { ScheduleForm } from "@/components/forms/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDoctorSchedule } from "@/data/doctorSchedule";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function SchedulePage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  const doctorSchedule = await getDoctorSchedule(user.doctorId);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <ScheduleForm schedule={doctorSchedule} />
      </CardContent>
    </Card>
  );
}
