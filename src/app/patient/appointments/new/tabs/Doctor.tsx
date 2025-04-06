"use client";

import { DataTable } from "@/components/tables/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getColumns } from "./columns";
import { type Doctor } from "@/schemas/doctor";
import { type Procedure } from "@/schemas/admin/procedures";

export const DoctorTab = ({
  doctors,
  setSelectedDoctorAction,
  setSelectedProcedureAction,
  setCurrentStepAction,
}: {
  doctors: Doctor[];
  setSelectedDoctorAction: (doctor: Doctor) => void;
  setSelectedProcedureAction: (procedure: Procedure | null) => void;
  setCurrentStepAction: (step: number) => void;
}) => {
  //
  const columns = getColumns(
    setSelectedDoctorAction,
    setSelectedProcedureAction,
    setCurrentStepAction,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Doctors</CardTitle>
        <CardDescription className="text-md">
          Choose the doctor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="mx-auto">
          <DataTable columns={columns} data={doctors} filter="name" />
        </div>
      </CardContent>
    </Card>
  );
};
