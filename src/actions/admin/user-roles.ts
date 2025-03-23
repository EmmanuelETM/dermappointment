"user server";

import { updateRoleSchema } from "@/schemas/admin/user-role";
import { db } from "@/server/db";
import { patients, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

async function deletePatientRecord(userId: string) {
  await db.delete(patients).where(eq(patients.userId, userId));
}

async function insertDoctorRecord(userId: string) {
  return;
}
