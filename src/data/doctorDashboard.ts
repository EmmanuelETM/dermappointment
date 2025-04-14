import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { count, eq, and, gte, lte } from "drizzle-orm";
import { startOfMonth, endOfMonth } from "date-fns";

const now = new Date();
const start = startOfMonth(now);
const end = endOfMonth(now);

export async function getPatientsCount() {
  const totalPatients = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.role, "PATIENT"));

  const patientsThisMonth = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        eq(users.role, "PATIENT"),
        gte(users.createdAt, start),
        lte(users.createdAt, end),
      ),
    );

  const result = {
    total: totalPatients[0]?.count,
    thisMonth: patientsThisMonth[0]?.count,
  };

  return result;
}
