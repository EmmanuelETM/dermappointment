import { Separator } from "@/components/ui/separator";
import { type Payment, columns } from "./columns";
import { DataTable } from "@/components/tables/data-table";
import { Hospital, Mountain, ShieldUser, User, Waves } from "lucide-react";

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
      email: "a@example.com",
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

  const RolePopover = [
    {
      value: "ADMIN",
      label: "Admin",
      icon: ShieldUser,
    },
    {
      value: "DOCTOR",
      label: "Doctor",
      icon: Hospital,
    },
    {
      value: "PATIENT",
      label: "Patient",
      icon: User,
    },
  ];

  const LocationPopover = [
    {
      value: "La Vega",
      label: "La Vega",
      icon: Mountain,
    },
    {
      value: "Puerto Plata",
      label: "Puerto Plata",
      icon: Waves,
    },
  ];

  const popoverData = [RolePopover, LocationPopover];

  return (
    <>
      <p className="py-2 text-lg font-bold">Transactions</p>
      <Separator />
      <div className="container mx-auto py-1">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}
