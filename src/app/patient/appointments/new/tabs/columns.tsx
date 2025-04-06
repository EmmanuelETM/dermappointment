"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

import { type Doctor } from "@/schemas/doctor";
import { SpecialtiesArraySchema } from "@/schemas/admin/specialties";
import { PatientDoctorsSpecialties } from "@/components/dialog/patient/specialties/specialties";

export const getColumns = (
  setSelectedDoctor: (doctor: Doctor) => void,
  setSelectedProcedure: (procedure: null) => void,
  setCurrentStep: (step: number) => void,
): ColumnDef<Doctor>[] => {
  return [
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <SelectDoctorButton
          doctor={row.original}
          setSelectedDoctor={setSelectedDoctor}
          setSelectedProcedure={setSelectedProcedure}
          setCurrentStep={setCurrentStep}
        />
      ),
    },
  ];
};

const SelectDoctorButton = ({
  doctor,
  setSelectedDoctor,
  setSelectedProcedure,
  setCurrentStep,
}: {
  doctor: Doctor;
  setSelectedDoctor: (doctor: Doctor) => void;
  setSelectedProcedure: (procedure: null) => void;
  setCurrentStep: (step: number) => void;
}) => {
  return (
    <div className="text-right">
      <Button
        onClick={() => {
          setSelectedDoctor(doctor);
          setSelectedProcedure(null); // Reseteamos el procedimiento
          setCurrentStep(2);
        }}
        className="p-2"
      >
        <Check />
      </Button>
    </div>
  );
};
