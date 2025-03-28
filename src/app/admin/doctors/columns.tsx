"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Copy, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type Doctor } from "@/schemas/doctor";
import { useRouter } from "next/navigation";
import { DoctorsProcedures } from "@/components/dialog/admin/doctors/procedures";
import { DoctorsSpecialties } from "@/components/dialog/admin/doctors/specialties";
import { ProceduresArraySchema } from "@/schemas/admin/procedures";
import { SpecialtyArraySchema } from "@/schemas/admin/specialties";

export const columns: ColumnDef<Doctor>[] = [
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
    id: "specialties",
    accessorKey: "specialties",
    header: () => <div className="pl-2">Specialties</div>,
    cell: ({ row }) => {
      const specialties = row.getValue("specialties");
      const parsed = SpecialtyArraySchema.parse(specialties);
      return <DoctorsSpecialties specialties={parsed} />;
    },
  },
  {
    id: "procedures",
    accessorKey: "procedures",
    header: () => <div className="pl-2">Procedures</div>,
    cell: ({ row }) => {
      const procedures = row.getValue("procedures");
      const parsed = ProceduresArraySchema.parse(procedures);
      return <DoctorsProcedures procedures={parsed} />;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => <ActionMenu doctorId={row.original.doctorId} />,
  },
];

const ActionMenu = ({ doctorId }: { doctorId: string }) => {
  const router = useRouter();

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
            onClick={() => navigator.clipboard.writeText(doctorId)}
          >
            <Copy /> Doctor Id
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => router.push(`/admin/doctors/${doctorId}`)}
          >
            <Edit /> Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
