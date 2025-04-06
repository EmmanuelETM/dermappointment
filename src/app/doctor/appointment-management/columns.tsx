"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Check,
  CircleDot,
  CalendarCheck,
  Ban,
  BookCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { type Appointment } from "@/schemas/appointment";
import { format } from "date-fns-tz/format";
import { subMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { type APPOINTMENT_STATUS } from "@/data/constants";
import { updateAppointmentStatus } from "@/actions/appointments/updateAppointmentStatus";
import { toast } from "sonner";
import { CancelAppointmentDialog } from "@/components/dialog/doctor/appointment/cancel-appointment";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // String(status)}
      const status = row.getValue("status");
      return (
        <div className="flex flex-row justify-start">
          <div
            className={cn(
              "ml-4 flex w-32 flex-row items-center gap-2 rounded-lg p-2 py-1.5 text-sm font-medium",
              status === "Pending" && "bg-yellow-500/40 dark:bg-yellow-400/50",
              status === "Confirmed" && "bg-cyan-500/40 dark:bg-cyan-400/50",
              status === "Cancelled" && "bg-rose-500/40 dark:bg-rose-400/50",
              status === "Completed" && "bg-green-700/40 dark:bg-green-400/50",
            )}
          >
            {status === "Pending" ? (
              <CircleDot size={16} />
            ) : status === "Confirmed" ? (
              <CalendarCheck size={16} />
            ) : status === "Cancelled" ? (
              <Ban size={16} />
            ) : (
              <BookCheck size={16} />
            )}
            {String(status)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "patient",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const patient = row.getValue("patient");
      return <div className="ml-4">{String(patient)}</div>;
    },
  },

  {
    accessorKey: "procedure",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Procedure
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const procedure = row.getValue("procedure");
      return <div className="ml-4">{String(procedure)}</div>;
    },
  },
  {
    accessorKey: "startTime",
    id: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.getValue("startTime");
      return (
        <div className="ml-4">
          {format(subMinutes(date as string, 15), "yyyy/MM/dd", {
            timeZone: row.original.timezone!,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Start",
    cell: ({ row }) => {
      const startTime = row.getValue("startTime");
      return (
        <div>
          {format(subMinutes(startTime as string, 15), "hh:mm a", {
            timeZone: row.original.timezone!,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "endTime",
    header: "End",
    cell: ({ row }) => {
      const endTime = row.getValue("endTime");
      return (
        <div>
          {format(subMinutes(endTime as string, 15), "hh:mm a", {
            timeZone: row.original.timezone!,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <ActionButtons
          appointmentId={row.original.id}
          status={row.original.status}
        />
      );
    },
  },
];

function ActionButtons({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: (typeof APPOINTMENT_STATUS)[number];
}) {
  if (status === "Pending" || status === "Confirmed") {
    return (
      <div className="flex flex-row justify-end gap-1 text-right">
        <CancelAppointmentDialog appointmentId={appointmentId} />

        {status === "Pending" ? (
          <Button
            className="p-2"
            onClick={async () => {
              const response = await updateAppointmentStatus(
                appointmentId,
                "Confirmed",
              );

              if (response?.success) toast(response?.success);
              if (response?.error) toast(response?.error);
            }}
          >
            <Check />
          </Button>
        ) : (
          <Button
            className="bg-green-700/40 p-2 text-black hover:bg-green-700/60 dark:bg-green-400/50 dark:text-white"
            onClick={async () => {
              const response = await updateAppointmentStatus(
                appointmentId,
                "Completed",
              );

              if (response?.success) toast(response?.success);
              if (response?.error) toast(response?.error);
            }}
          >
            <BookCheck size={16} />
          </Button>
        )}
      </div>
    );
  }
}
