import { ScheduleForm } from "@/components/forms/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/server/db";
import { schedule } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export default async function SchedulePage() {
  const user = await currentUser();

  const doctorSchedule = await db.query.schedule.findFirst({
    where: eq(schedule?.doctorId, user?.doctorId ?? ""),
    columns: {
      id: true,
      timezone: true,
    },
    with: {
      scheduleAvailability: {
        columns: {
          start: true,
          end: true,
          weekDay: true,
        },
      },
    },
  });

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
