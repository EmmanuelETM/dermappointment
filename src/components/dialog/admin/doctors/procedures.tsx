import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Eye } from "lucide-react";

import { type Procedure } from "@/schemas/admin/procedures";

export function DoctorsProcedures({ procedures }: { procedures: Procedure[] }) {
  console.log(procedures);
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex cursor-pointer items-center gap-2 pl-0 text-sm text-blue-500">
          <Eye size="16px" />
          <p className="hover:underline">Procedures</p>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
