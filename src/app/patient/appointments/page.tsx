import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/currentUser";
import {
  CalendarDays,
  CalendarRange,
  Clock2,
  MapPin,
  User,
  Text,
  Plus,
  CalendarPlus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getActiveAppointmentsData } from "@/data/appointments";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns-tz/format";
import { subMinutes } from "date-fns";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AppointmentPage() {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  const appointments = await getActiveAppointmentsData("userId", user.id);

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
        <Button asChild className="flex items-center space-x-2">
          <Link href="/patient/appointments/new/">
            <CalendarPlus />
            <span>New</span>
          </Link>
        </Button>
      </div>

      {appointments.length > 0 ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id}
                className="w-full rounded-2xl transition-all duration-300"
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
                        {format(
                          subMinutes(appointment.endTime, 15),
                          "hh:mm a",
                          {
                            timeZone: appointment.timezone!,
                          },
                        )}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <User size={20} />
                      {appointment.doctor}
                    </div>
                    <div></div>
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium", // nota el uso de `inline-flex` y `px-2`
                        appointment.location === "Puerto Plata" &&
                          "bg-blue-900/10 text-blue-900 dark:bg-blue-500/20 dark:text-blue-200",
                        appointment.location === "La Vega" &&
                          "bg-green-900/10 text-green-900 dark:bg-green-500/20 dark:text-green-200",
                        !appointment.location && "text-muted-foreground",
                      )}
                    >
                      <MapPin size={16} className="shrink-0" />
                      {appointment.location}
                    </div>

                    <CardDescription className="mt-2 flex flex-col gap-2">
                      <div>
                        <HoverCard openDelay={2}>
                          <HoverCardTrigger>
                            <Button variant="link" className="p-0">
                              <Text size={20} />
                              Description
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            {appointment.description ?? ""}
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </CardDescription>
                  </div>
                </CardContent>
                <Footer
                  appointmentId={appointment.id}
                  status={appointment.status}
                />
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
          <CalendarRange className="mx-auto size-16" />
          No Appointments Available
        </div>
      )}
    </div>
  );
}
