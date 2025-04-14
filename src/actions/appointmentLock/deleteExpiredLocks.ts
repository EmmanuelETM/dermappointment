"use server";

import { db } from "@/server/db";
import { appointmentLock } from "@/server/db/schema";
import { lt } from "drizzle-orm";

export async function deleteExpiredLocks() {
  const now = new Date();

  const deleted = await db
    .delete(appointmentLock)
    .where(lt(appointmentLock.expires, now));

  return deleted;
}
