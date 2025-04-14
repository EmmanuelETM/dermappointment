"use client";

import { cancelAppointmentWithOptionalRefund } from "@/actions/appointments/patientCancelAppointment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CancelAppointmentDialog({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const router = useRouter();

  const handleCancel = async () => {
    const response = await cancelAppointmentWithOptionalRefund(appointmentId);

    if (response?.error) {
      toast("Could not cancel Appointment");
    }

    if (response?.success) {
      toast(response?.success);
      router.push("/patient/appointments");
    }

    return;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-2" variant="destructiveGhost">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <p className="py-2 text-sm text-muted-foreground">
            Are you sure you want to cancel this appointment? This action cannot
            be undone.
          </p>
        </DialogHeader>

        <DialogFooter className="flex flex-row justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">No, go back</Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructiveGhost"
            onClick={() => handleCancel()}
          >
            Yes, I&apos;m sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
