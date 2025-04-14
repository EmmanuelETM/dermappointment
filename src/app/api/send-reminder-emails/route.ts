import { NextResponse } from "next/server";
import { env } from "@/env";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { getAppointmentsInRange } from "@/data/appointments";
import { sendReminderEmail } from "@/lib/mail/appointment";
import { db } from "@/server/db"; // Suponiendo que tienes acceso a la base de datos aquí
import { notificationLogs } from "@/server/db/schema"; // Asegúrate de tener la tabla correcta
import { and, eq, gte } from "drizzle-orm";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfTomorrow = startOfDay(addDays(now, 1)); // Empieza a las 00:00 de mañana
  const endOfTomorrow = endOfDay(startOfTomorrow); // Fin de mañana a las 23:59

  try {
    // Obtener citas para el día siguiente (mañana)
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
        // Verificar si ya existe un registro de notificación para este usuario y cita

        const existingLog = await db.query.notificationLogs.findFirst({
          where: and(
            eq(notificationLogs.userId, appt.patients.id),
            eq(notificationLogs.type, "Email"),
            eq(notificationLogs.status, "Sent"),
            gte(notificationLogs.createdAt, startOfTomorrow), // Compara con el inicio de mañana
          ),
        });

        if (!existingLog) {
          // Si no existe un log, entonces enviamos el correo
          await sendReminderEmail(appt.patients.email!, appt);

          // Insertar log en la base de datos
          await db.insert(notificationLogs).values({
            userId: appt.patients.id,
            type: "Email",
            content: `Reminder email sent for appointment ${appt.id}`,
            status: "Sent",
            createdAt: new Date(), // Si es necesario para tener registro de cuándo se envió
          });

          return { status: "fulfilled" };
        }

        return { status: "rejected" }; // Si el log ya existe, no enviamos el correo
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
    console.error("Error en el cron job:", error); // Mejor para depuración
    return NextResponse.json(
      { error: "Ocurrió un error al procesar los correos" },
      { status: 500 },
    );
  }
}
