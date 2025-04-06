import { type PopoverGroup, type PopoverItem } from "@/types/tables";

const StatusPopover: PopoverItem = {
  column: "status",
  title: "Status",
  options: [
    {
      value: "Pending",
      label: "Pending",
      iconKey: "CircleDot",
    },
    {
      value: "Confirmed",
      label: "Confirmed",
      iconKey: "CalendarCheck",
    },
    {
      value: "Cancelled",
      label: "Cancelled",
      iconKey: "Ban",
    },
    {
      value: "Completed",
      label: "Completed",
      iconKey: "BookCheck",
    },
  ],
};

export const popoverConfig: PopoverGroup = {
  items: [StatusPopover],
};
