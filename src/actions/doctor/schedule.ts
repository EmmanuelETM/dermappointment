"use server";

import { currentUser } from "@/lib/currentUser";
import { ScheduleFormSchema } from "@/schemas/schedule";
import { db } from "@/server/db";
import { schedule, scheduleAvailability } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { type BatchItem } from "drizzle-orm/batch";
import { type z } from "zod";

export async function saveSchedule(values: z.infer<typeof ScheduleFormSchema>) {
  try {
    const user = await currentUser();
    if (!user) return { error: "No doctor found" };

    const validatedFields = ScheduleFormSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid schedule data" };

    const { availabilities = [], ...scheduleData } = validatedFields.data;

    const insertedSchedule = await db
      .insert(schedule)
      .values({ ...scheduleData, doctorId: user.doctorId })
      .onConflictDoUpdate({
        target: schedule.doctorId,
        set: scheduleData,
      })
      .returning({ id: schedule.id });

    if (!insertedSchedule.length || !insertedSchedule[0]?.id) {
      return { error: "Failed to save schedule" };
    }

    const scheduleId = insertedSchedule[0]?.id;

    const statements: [BatchItem<"pg">] = [
      db
        .delete(scheduleAvailability)
        .where(eq(scheduleAvailability.scheduleId, scheduleId)),
    ];

    if (availabilities.length > 0) {
      statements.push(
        db.insert(scheduleAvailability).values(
          availabilities.map((availability) => ({
            ...availability,
            scheduleId,
          })),
        ),
      );
    }

    await db.batch(statements);

    return { success: "Schedule Saved!" };
  } catch (error) {
    console.error("Error saving schedule:", error);
    return { error: "Something went wrong in Server" };
  }
}
