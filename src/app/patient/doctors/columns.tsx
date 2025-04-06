"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import { type Doctor } from "@/schemas/doctor";
import { useRouter } from "next/navigation";
import { SpecialtiesArraySchema } from "@/schemas/admin/specialties";
import { PatientDoctorsSpecialties } from "@/components/dialog/patient/specialties/specialties";
import { PatientDoctorsProcedures } from "@/components/dialog/patient/procedures/procedures";
import { ProcedureArraySchema } from "@/schemas/admin/procedures";

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
      const parsed = SpecialtiesArraySchema.parse(specialties);
      return <PatientDoctorsSpecialties specialties={parsed} />;
    },
  },
  {
    id: "procedures",
    accessorKey: "procedures",
    header: () => <div className="pl-2">Procedures</div>,
    cell: ({ row }) => {
      const procedures = row.getValue("procedures");
      const parsed = ProcedureArraySchema.parse(procedures);
      return <PatientDoctorsProcedures procedures={parsed} />;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionButtons doctorId={row.original.doctorId} />;
    },
  },
];

function ActionButtons({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const encodedDoctor = encodeURIComponent(doctorId);

  return (
    <div className="flex flex-row justify-end gap-1 text-right">
      <Button
        className="p-2"
        variant="outline"
        onClick={() => router.push(`/patient/chat?doctor=${encodedDoctor}`)}
      >
        <Send />
      </Button>
      <Button
        className="p-2"
        onClick={() =>
          router.push(`/patient/appointments/new?doctor=${encodedDoctor}`)
        }
      >
        <Check />
      </Button>
    </div>
  );
}
