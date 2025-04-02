import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/currentUser";
import { db } from "@/server/db";
import { and, desc, eq } from "drizzle-orm";
import { appointment, procedures } from "@/server/db/schema";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AppointmentPage() {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const appointments = await db.query.appointment.findMany({
    where: and(eq(appointment.userId, user.id), eq(appointment.status, true)),
    with: {
      doctors: {
        with: {
          users: {
            columns: {
              name: true,
            },
          },
        },
      },
      procedures: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: desc(appointment.date),
  });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="py-2 text-2xl font-semibold lg:text-3xl">
          Appointments
        </h1>
        <Button asChild className="flex flex-row">
          <Link href="/patient/appointments/new">
            <CalendarPlus /> New
          </Link>
        </Button>
      </div>
      {appointments.length > 0 ? (
        <h1></h1>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
          <CalendarRange className="mx-auto size-16" />
          You do not have any appointments yet. Create a new Appointment to get
          Started!
          <Button asChild className="flex flex-row" variant="outline">
            <Link href="/patient/appointments/new">
              <CalendarPlus /> New Appointment
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
