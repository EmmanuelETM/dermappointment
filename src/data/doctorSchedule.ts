import { db } from "@/server/db";
import { schedule } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getDoctorSchedule(doctorId: string) {
  return await db.query.schedule.findFirst({
    where: eq(schedule.doctorId, doctorId),
    columns: {
      id: true,
      timezone: true,
    },
    with: {
      scheduleAvailability: {
        columns: {
          startTime: true,
          endTime: true,
          weekDay: true,
          location: true,
        },
      },
    },
  });
}
