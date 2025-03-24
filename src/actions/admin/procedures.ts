"use server";

import { db } from "@/server/db";
import { procedures } from "@/server/db/schema";
import { type z } from "zod";
import { ProcedureFormSchema } from "@/schemas/admin/procedures";
import { revalidatePath } from "next/cache";

export async function createProcedure(
  values: z.infer<typeof ProcedureFormSchema>,
) {
  const validatedFields = ProcedureFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, description, price } = validatedFields.data;

  try {
    await db.insert(procedures).values({
      name: name,
      description: description,
      price: price,
    });

    revalidatePath("/admin/procedures");
    return { success: "Procedure Created" };
  } catch (err) {
    console.log(err);
    return { error: "Something went wrong!" };
  }
}
