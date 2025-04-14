import { NextResponse } from "next/server";
import { env } from "@/env";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { getAppointmentsInRange } from "@/data/appointments";
import { sendReminderEmail } from "@/lib/mail/appointment";
import { db } from "@/server/db";
import { notificationLogs } from "@/server/db/schema";
import { and, eq, gte } from "drizzle-orm";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfTomorrow = startOfDay(addDays(now, 1));
  const endOfTomorrow = endOfDay(startOfTomorrow);

  try {
    const appointmentsForTomorrow = await getAppointmentsInRange(
      startOfTomorrow,
      endOfTomorrow,
    );

    if (!appointmentsForTomorrow || appointmentsForTomorrow.length === 0) {
      return NextResponse.json(
        { error: "No appointments found for tomorrow" },
        { status: 404 },
      );
    }

    const sendResults = await Promise.allSettled(
      appointmentsForTomorrow.map(async (appt) => {
        const existingLog = await db.query.notificationLogs.findFirst({
          where: and(
            eq(notificationLogs.userId, appt.patients.id),
            eq(notificationLogs.type, "Email"),
            eq(notificationLogs.status, "Sent"),
            gte(notificationLogs.createdAt, startOfDay(new Date())),
          ),
        });

        if (!existingLog) {
          await sendReminderEmail(appt.patients.email!, appt);

          await db.insert(notificationLogs).values({
            userId: appt.patients.id,
            type: "Email",
            content: `Reminder email sent for appointment ${appt.id}`,
            status: "Sent",
            createdAt: new Date(),
          });

          return { status: "fulfilled" };
        }

        return { status: "rejected" };
      }),
    );

    const successCount = sendResults.filter(
      (r) => r.status === "fulfilled",
    ).length;

    const failCount = sendResults.filter((r) => r.status === "rejected").length;

    return NextResponse.json(
      {
        message: "Emails processed successfully",
        total: sendResults.length,
        enviados: successCount,
        fallidos: failCount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en el cron job:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al procesar los correos" },
      { status: 500 },
    );
  }
}
