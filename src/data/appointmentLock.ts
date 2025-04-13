import { db } from "@/server/db";
import { appointmentLock } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getAppointmentLockById(lockId: string) {
  return await db.query.appointmentLock.findFirst({
    where: eq(appointmentLock.id, lockId),
  });
}
