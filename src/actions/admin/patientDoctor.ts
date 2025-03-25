"use server";

import { getUserById } from "@/data/user";
import { UserSchema } from "@/schemas/user";
import { db } from "@/server/db";
import { doctors, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type z } from "zod";

export async function changePatientToDoctor(
  values: z.infer<typeof UserSchema>,
) {
  const validatedData = UserSchema.safeParse(values);
  if (!validatedData.success) {
    return;
  }

  const { id, role } = validatedData.data;

  if (role !== "PATIENT") {
    return { error: "Only Patients can become doctors" };
  }

  try {
    const user = await getUserById(id!);

    if (!user || user.role !== "PATIENT") {
      return { error: "Only Patients can become doctors" };
    }

    await db.update(users).set({ role: "DOCTOR" }).where(eq(users.id, user.id));

    await db.insert(doctors).values({ userId: user.id });

    revalidatePath("/admin/users");

    return { success: "User updated" };
  } catch {
    return { error: "Something went wrong!" };
  }
}
