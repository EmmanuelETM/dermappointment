import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/tables/data-table";
import { type Payment, columns } from "./columns";
import { popoverConfig } from "./popoverConfig";

// async function getUserData() {
//   try {
//     const data = await db.query.users.findMany();
//     return data;
//   } catch {
//     console.log("error");
//   }
// }

//Todo add type safety to all types with zod, and also this function on top

async function getUserData(): Promise<Payment[]> {
  return [
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
      <div className="container mx-auto px-4">
        <p className="py-2 text-lg font-bold">Users</p>
        <DataTable
          columns={columns}
          data={data}
          filter="name"
          popoverConfig={popoverConfig}
        />
      </div>
    </>
  );
}
