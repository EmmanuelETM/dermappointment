"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type User } from "@/schemas/user";
import { changePatientToDoctor } from "@/actions/admin/patientDoctor";
import { toast } from "sonner";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email");
      return <div className="ml-4">{String(email)}</div>;
    },
  },
  {
    id: "Role",
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "Location",
    accessorKey: "location",
    header: "Location",
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id!)}
              >
                Copy User Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Save Changes</DropdownMenuItem>
              {user.role === "PATIENT" ? (
                <DropdownMenuItem
                  onClick={async () => {
                    const response = await changePatientToDoctor(user);
                    if (response?.success) toast(response.success);
                    if (response?.error) toast(response.error);
                  }}
                >
                  Set Doctor
                </DropdownMenuItem>
              ) : (
                ""
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
