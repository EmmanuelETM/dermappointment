"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAppointmentByLockId } from "@/data/appointments";
import { HashLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { format, subMinutes } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, RotateCw } from "lucide-react";
import { AppointmentSummaryCard } from "@/components/AppointmentSummaryCard";

export default function AppointmentInfo({
  lockId,
  amount,
  isSuccess,
}: {
  lockId: string;
  amount: number;
  isSuccess: boolean;
}) {
  const [maxRetriesReached, setMaxRetriesReached] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  const { data, error, isFetching } = useQuery({
    queryKey: ["appointment", lockId],
    queryFn: () => getAppointmentByLockId(lockId),
    refetchInterval: 1000,
    retry: (failureCount) => {
      if (failureCount >= 10) {
        setMaxRetriesReached(true);
        return false;
      }
      return true;
    },
  });

  if (maxRetriesReached) {
    return (
      <Card className="min-w-3xl mx-auto">
        <CardHeader className="center flex flex-row justify-between">
          <CardTitle className="text-xl font-semibold sm:text-2xl">
            We couldn&apos;t find the Appointment.
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-2">
          Try reloading the page.
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={() => router.refresh()}>
            <RotateCw />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isFetching && !data)
    return (
      <Card className="min-w-3xl mx-auto">
        <CardHeader className="center flex flex-row justify-between">
          <CardTitle className="text-xl font-semibold sm:text-2xl">
            Getting Appointment Info
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-2">
          <HashLoader color={theme.theme === "dark" ? "white" : "black"} />
          <span>Loading...</span>
        </CardContent>
      </Card>
    );

  if (error) {
    return (
      <Card className="min-w-3xl mx-auto">
        <CardHeader className="center flex flex-row justify-between">
          <CardTitle className="text-xl font-semibold sm:text-2xl">
            There was an error getting your Appointment Info!
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex items-center justify-center">
          <Button onClick={() => router.push("/patient/appointments/")}>
            Go to Appointments
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const title = "Appointment Scheduled Successfully!";
  const description = `Your appointment has been scheduled and is currently awaiting confirmation from the doctor.\nYou'll be notified once it's confirmed.`;

  return (
    <>
      {isSuccess ? (
        <AppointmentSummaryCard
          title={title}
          description={description}
          amount={amount}
          data={data!}
        />
      ) : (
        <Card className="min-w-3xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <CardHeader className="center flex flex-row justify-between">
              <CardTitle className="text-xl font-semibold sm:text-2xl">
                There was an error Scheduling your Appointment!
              </CardTitle>
            </CardHeader>
            <CardContent>Something went wrong. Please try again.</CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/patient/appointments/new")}>
                Try Again
              </Button>
            </CardFooter>
          </div>
        </Card>
      )}
    </>
  );
}
