import { DataTable } from "@/components/tables/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Specialty } from "@/schemas/admin/specialties";

import { Eye } from "lucide-react";
import { columns } from "./column";

export function DoctorsSpecialties({
  specialties,
}: {
  specialties: Specialty[];
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex cursor-pointer items-center gap-2 pl-0 text-sm text-blue-500">
          <Eye size="16px" />
          <p className="hover:underline">Specialties</p>
        </span>
      </DialogTrigger>
      <DialogContent className="container max-h-[80vh] max-w-2xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Specialties</DialogTitle>
        </DialogHeader>
        <DataTable columns={columns} data={specialties} filter="name" />
      </DialogContent>
    </Dialog>
  );
}
