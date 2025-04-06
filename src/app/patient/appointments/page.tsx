import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/currentUser";
import {
  CalendarDays,
  CalendarPlus,
  CalendarRange,
  Clock2,
  ClockArrowDown,
  ClockArrowUp,
  MapPin,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppointmentsData } from "@/data/appointments";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns-tz/format";

export default async function AppointmentPage() {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const appointments = await getAppointmentsData("userId", user?.id, "Pending");

  if (!user || !user.id) {
    redirect("/login");
  }
  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="py-2 text-2xl font-semibold text-gray-900 dark:text-white lg:text-3xl">
          Appointments
        </h1>
        <Button
          asChild
          className="flex items-center space-x-2"
          variant="outline"
        >
          <Link href="/patient/appointments/new">
            <CalendarPlus />
            <span>New</span>
          </Link>
        </Button>
      </div>

      {/* Conditionally render appointments */}
      {appointments.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="w-full rounded-2xl border shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="mb-2 text-lg font-semibold">
                    {appointment.procedure ?? "Procedure"}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex flex-col gap-2">
                      <span className="flex flex-row items-center gap-2">
                        <CalendarDays size={20} />
                        {format(appointment.startTime, "yyyy/MM/dd", {
                          timeZone: appointment.timezone!,
                        })}
                      </span>
                      <span className="flex flex-row items-center gap-2">
                        <Clock2 size={20} />
                        {format(appointment.startTime, "hh:mm a", {
                          timeZone: appointment.timezone!,
                        })}{" "}
                        -{" "}
                        {format(appointment.endTime, "hh:mm a", {
                          timeZone: appointment.timezone!,
                        })}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <MapPin size={20} />
                      {appointment.location ?? ""}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <User size={20} />
                      {appointment.doctor ?? ""}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="destructiveGhost">
                    <Trash2 />
                  </Button>
                  <Button type="button">Edit</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
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
