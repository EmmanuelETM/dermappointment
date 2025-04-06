import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/currentUser";
import {
  CalendarDays,
  CalendarRange,
  Clock2,
  MapPin,
  User,
  Text,
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

export default async function AppointmentPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  const appointments = await getActiveAppointmentsData(
    "doctorId",
    user?.doctorId,
  );

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
      </div>

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
                      {appointment.patient ?? ""}
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <MapPin size={20} />
                      {appointment.location ?? ""}
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
                <Footer status={appointment.status} />
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
