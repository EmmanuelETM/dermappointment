"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { type FullAppointment } from "@/schemas/appointment";
import { Printer } from "lucide-react";
import { Button } from "./ui/button";
import { format, subMinutes } from "date-fns";
import { useRouter } from "next/navigation";

type AppointmentSummaryCard = {
  title: string;
  description: string;
  amount: number;
  data: FullAppointment;
};

export function AppointmentSummaryCard({
  title,
  description,
  amount,
  data,
}: AppointmentSummaryCard) {
  const router = useRouter();
  return (
    <Card className="mx-auto w-full max-w-xl">
      <div>
        <CardHeader className="center flex flex-col justify-between gap-3 text-center">
          <CardTitle className="text-xl font-semibold sm:text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="max-w-full whitespace-pre-line">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <Separator />
          <div className="pb-3 text-lg font-semibold">Appointment Details:</div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">No.</span>
            <span>{data.id}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Doctor:</span>
            <span>{data.doctors.users.name}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Procedure:</span>
            <span>{data.procedures.name}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Date:</span>
            <span>
              {format(new Date(data.startTime), "eeee, MMMM d, yyyy")}
            </span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Time:
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {format(new Date(data.startTime), "hh:mm a")} –{" "}
              {format(subMinutes(new Date(data.endTime), 15), "hh:mm a")}
            </span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3">
            <span className="font-semibold">Timezone:</span>
            <span>{data.timezone}</span>
          </div>

          <div className="flex flex-row items-center justify-start gap-3 pb-2">
            <span className="font-semibold">Location:</span>
            <span>{data.location}</span>
          </div>

          <Separator />
        </CardContent>
        <CardFooter className="flex items-center justify-between text-lg">
          <div className="flex flex-row items-center gap-4">
            <span className="font-semibold">Amount Paid:</span>
            <span className="text-base font-semibold text-gray-900 dark:text-white">
              ${(amount / 100).toFixed(2)}
            </span>
          </div>
          <Button onClick={() => router.refresh()}>
            <Printer size={48} />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
