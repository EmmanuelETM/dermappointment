"use client";

import { CancelAppointmentDialog } from "@/components/dialog/doctor/appointment/cancel-appointment";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { type APPOINTMENT_STATUS } from "@/data/constants";
import { cn } from "@/lib/utils";
import { CalendarCheck, CircleDot, Edit } from "lucide-react";
import { useRouter } from "next/navigation";

export function Footer({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: (typeof APPOINTMENT_STATUS)[number];
}) {
  const encoded = encodeURIComponent(appointmentId);
  const router = useRouter();
  return (
    <CardFooter className="flex flex-row justify-between gap-2">
      <div
        className={cn(
          "flex flex-row items-center justify-center gap-2 rounded-lg p-2 py-1.5 text-sm font-medium",
          status === "Pending" && "bg-yellow-500/40 dark:bg-yellow-400/50",
          status === "Confirmed" && "bg-cyan-500/40 dark:bg-cyan-400/50",
        )}
      >
        {status === "Pending" ? (
          <CircleDot size={16} />
        ) : (
          <CalendarCheck size={16} />
        )}
        {status}
      </div>
      <div className="flex flex-row items-center gap-2">
        <CancelAppointmentDialog appointmentId={appointmentId} />
        <Button
          className="p-2"
          onClick={() =>
            router.push(`/patient/appointments/edit?appointment=${encoded}`)
          }
        >
          <Edit />
        </Button>
      </div>
    </CardFooter>
  );
}
