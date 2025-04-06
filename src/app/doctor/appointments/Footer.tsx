"use client";

import { CardFooter } from "@/components/ui/card";
import { type APPOINTMENT_STATUS } from "@/data/constants";
import { cn } from "@/lib/utils";
import { CalendarCheck, CircleDot } from "lucide-react";

export function Footer({
  status,
}: {
  status: (typeof APPOINTMENT_STATUS)[number];
}) {
  return (
    <CardFooter className="flex w-full gap-2">
      <div
        className={cn(
          "flex w-full flex-row items-center justify-center gap-2 rounded-lg p-2 py-1.5 text-sm font-medium",
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
    </CardFooter>
  );
}
