import { db } from "@/server/db";
import { procedures } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getProcedureById(procedureId: string) {
  return await db.query.procedures.findFirst({
    where: eq(procedures.id, procedureId),
  });
}
