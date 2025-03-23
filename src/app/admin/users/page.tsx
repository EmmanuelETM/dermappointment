import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { type Payment, columns } from "./columns";
import { popoverConfig } from "./popoverConfig";

async function getUserData(): Promise<Payment[]> {
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
  const data = await getUserData();

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
