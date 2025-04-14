import { NextResponse } from "next/server";
import { env } from "@/env";
import { addDays, startOfDay, endOfDay } from "date-fns";
import { getAppointmentsInRange } from "@/data/appointments";
import { sendReminderEmail } from "@/lib/mail/appointment";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfTomorrow = startOfDay(addDays(now, 1)); // Inicio de mañana a las 00:00
  const endOfTomorrow = endOfDay(startOfTomorrow); // Fin de mañana a las 23:59

  try {
    // Obtener citas para el día siguiente
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

    // Enviar los correos a todos los pacientes de las citas
    const sendResults = await Promise.allSettled(
      appointmentsForTomorrow.map((appt) =>
        sendReminderEmail(appt.patients.email!, appt),
      ),
    );

    const successCount = sendResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const failCount = sendResults.length - successCount;

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
