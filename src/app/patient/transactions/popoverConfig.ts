import { type PopoverGroup, type PopoverItem } from "@/types/tables";

const TypePopover: PopoverItem = {
  column: "type",
  title: "Type",
  options: [
    {
      value: "Payment",
      label: "Payment",
      iconKey: "DollarSign",
    },
    {
      value: "Refund",
      label: "Refund",
      iconKey: "TicketX",
    },
  ],
};

export const popoverConfig: PopoverGroup = {
  items: [TypePopover],
};
