import { type FullAppointment } from "@/schemas/appointment";

import { format, subMinutes } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { currentUser } from "@/lib/currentUser";
import Link from "next/link";
import { CancelAppointmentDialog } from "@/components/dialog/patient/appointment/cancel-appointment";
import { Info } from "lucide-react";

export async function CancelAppointment({
  appointment,
}: {
  appointment: FullAppointment;
}) {
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  return (
    <Card className="mx-auto w-full max-w-xl">
      <div>
        <CardHeader className="center flex flex-col justify-between gap-3 text-center">
          <CardTitle className="text-xl font-semibold sm:text-2xl">
            Cancel Appointment
          </CardTitle>
          <CardDescription className="max-w-full whitespace-pre-line">
            Review the appointment details before canceling.
            <div className="flex flex-row items-center gap-2 pt-2 text-destructive">
              <p>
                If the appointment is in less than 24 hours, refunds will not be
                aplicable
              </p>
              <HoverCard>
                <HoverCardTrigger>
                  <Info />
                </HoverCardTrigger>
                <HoverCardContent>
                  Unless the appointment was created today.
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <Separator />
          <div className="pb-3 text-lg font-semibold">Appointment Details:</div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">No.</span>
            <span>{appointment.id}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Doctor:</span>
            <span>{appointment.doctors.users.name}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Procedure:</span>
            <span>{appointment.procedures.name}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Date:</span>
            <span>
              {format(new Date(appointment.startTime), "eeee, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Time:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {format(new Date(appointment.startTime), "hh:mm a")} –{" "}
              {format(subMinutes(new Date(appointment.endTime), 15), "hh:mm a")}
            </span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Timezone:</span>
            <span>{appointment.timezone}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3 pb-2">
            <span className="font-semibold">Location:</span>
            <span>{appointment.location}</span>
          </div>

          {appointment.description && (
            <div className="flex flex-row items-center justify-start gap-3 pb-2">
              <span className="font-semibold">Description:</span>
              <span>{appointment.description}</span>
            </div>
          )}

          <Separator />
        </CardContent>

        <CardFooter className="flex flex-col items-end gap-4 sm:flex-row sm:justify-between">
          <Link href={"/patient/appointments"}>
            <Button variant="outline">Back</Button>
          </Link>

          <CancelAppointmentDialog appointmentId={appointment.id} />
        </CardFooter>
      </div>
    </Card>
  );
}
