import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Specialty } from "@/schemas/admin/specialties";

import { Eye } from "lucide-react";

export function DoctorsSpecialties({
  specialties,
}: {
  specialties: Specialty[];
}) {
  console.log(specialties);
  return (
    <Dialog>
      <DialogTrigger>
        <span className="flex cursor-pointer items-center gap-2 pl-0 text-sm text-blue-500">
          <Eye size="16px" />
          <p className="hover:underline">Specialties</p>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            {specialties.map((specialty) => {
              return (
                <div
                  key={specialty.id}
                  className="flex items-center justify-evenly gap-2"
                >
                  <p>{specialty.id}</p>
                  <p>{specialty.name}</p>
                  <p>{specialty.description}</p>
                  <Button>Add</Button>
                  <Button>remove</Button>
                </div>
              );
            })}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
