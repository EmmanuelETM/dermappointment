"use server";

import { currentUser } from "@/lib/currentUser";
import { ScheduleFormSchema } from "@/schemas/schedule";
import { db } from "@/server/db";
import { schedule, scheduleAvailability } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type BatchItem } from "drizzle-orm/batch";
import { type z } from "zod";

export async function saveSchedule(values: z.infer<typeof ScheduleFormSchema>) {
  const user = await currentUser();

  const validatedFields = ScheduleFormSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid schedule data" };
  if (!user) return { error: "No doctor found" };

  const { availabilities, ...scheduleData } = validatedFields.data;

  const insertedSchedule = await db
    .insert(schedule)
    .values({ ...scheduleData, doctorId: user.doctorId })
    .onConflictDoUpdate({
      target: schedule.doctorId,
      set: scheduleData,
    })
    .returning({ id: schedule.id });

  const statements: BatchItem<"pg">[] = [];

  if (insertedSchedule[0]) {
    statements.push(
      db
        .delete(scheduleAvailability)
        .where(eq(scheduleAvailability.scheduleId, insertedSchedule[0].id)),
    );

    if (availabilities.length > 0) {
      statements.push(
        db.insert(scheduleAvailability).values(
          availabilities.map((availability) => ({
            ...availability,
            scheduleId: insertedSchedule[0]!.id,
          })),
        ),
      );
    }
  }
}
