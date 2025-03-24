"use server";

import { db } from "@/server/db";
import { specialties } from "@/server/db/schema";
import { type z } from "zod";
import { SpecialtyFormSchema } from "@/schemas/admin/specialties";
import { revalidatePath } from "next/cache";

export async function createSpecialty(
  values: z.infer<typeof SpecialtyFormSchema>,
) {
  const validatedFields = SpecialtyFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, description } = validatedFields.data;

  try {
    await db.insert(specialties).values({
      name: name,
      description: description,
    });

    revalidatePath("/admin/specialties");
    return { success: "Specialty Created" };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
  return;
}
