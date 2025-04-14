import { NextResponse } from "next/server";
import { env } from "@/env";
import { addHours } from "date-fns";
import { getAppointmentsInRange } from "@/data/appointments";
import { sendReminderEmail } from "@/lib/mail/appointment";

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneHourFromNow = addHours(now, 1);

  try {
    const appointmentsInOneHour = await getAppointmentsInRange(
      now,
      oneHourFromNow,
    );

    // if (!appointmentsInOneHour || appointmentsInOneHour.length === 0) {
    //   return NextResponse.json(
    //     { error: "No appointments found" },
    //     { status: 404 },
    //   );
    // }

    const sendResults = await Promise.allSettled(
      appointmentsInOneHour.map((appt) =>
        sendReminderEmail(appt.patients.email!, appt),
      ),
    );

    const successCount = sendResults.filter(
      (r) => r.status === "fulfilled",
    ).length;
    const failCount = sendResults.length - successCount;

    return NextResponse.json(
      {
        message: "Emails procesados",
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
