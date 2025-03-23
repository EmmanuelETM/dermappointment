import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { popoverConfig } from "./popoverConfig";
import { db } from "@/server/db";
import { type User } from "@/schemas/user";

async function getUserData(): Promise<User[]> {
  return await db.query.users.findMany();
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
