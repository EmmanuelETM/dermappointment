import { Separator } from "@/components/ui/separator";
import { type Payment, columns } from "./columns";
import { DataTable } from "@/components/tables/data-table";
import { Hospital, Mountain, ShieldUser, User, Waves } from "lucide-react";
import { PopoverGroup, PopoverItem } from "@/schemas/tables";

async function getData(): Promise<Payment[]> {
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
  ];
}

export default async function TransactionsPage() {
  const data = await getData();

  const RolePopover: PopoverItem = {
    column: "Role",
    title: "Role",
    options: [
      {
        value: "ADMIN",
        label: "Admin",
        iconKey: "ShieldUser",
      },
      {
        value: "DOCTOR",
        label: "Doctor",
        iconKey: "Hospital",
      },
      {
        value: "PATIENT",
        label: "Patient",
        iconKey: "User",
      },
    ],
  };

  const LocationPopover: PopoverItem = {
    column: "Location",
    title: "Location",
    options: [
      {
        value: "La Vega",
        label: "La Vega",
        iconKey: "Mountain",
      },
      {
        value: "Puerto Plata",
        label: "Puerto Plata",
        iconKey: "Waves",
      },
    ],
  };

  const popoverConfig: PopoverGroup = {
    items: [RolePopover, LocationPopover],
  };

  return (
    <>
      <p className="py-2 text-lg font-bold">Transactions</p>
      <Separator />
      <div className="container mx-auto py-1">
        <DataTable
          columns={columns}
          data={data}
          popoverConfig={popoverConfig}
        />
      </div>
    </>
  );
}
