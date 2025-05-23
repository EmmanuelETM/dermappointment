import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye } from "lucide-react";

import { type Procedure } from "@/schemas/admin/procedures";
import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";

export function PatientDoctorsProcedures({
  procedures,
}: {
  procedures: Procedure[];
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex cursor-pointer items-center gap-2 pl-0 text-sm text-blue-500">
          <Eye size="16px" />
          <p className="hover:underline">Procedures</p>
        </span>
      </DialogTrigger>
      <DialogContent className="container max-h-[80vh] max-w-2xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Procedures</DialogTitle>
        </DialogHeader>
        <DataTable columns={columns} data={procedures} filter="name" />
      </DialogContent>
    </Dialog>
  );
}
