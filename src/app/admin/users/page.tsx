import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { popoverConfig } from "./popoverConfig";
import { UsersFormDialog } from "@/components/dialog/admin/users-form";
import { getUserData } from "@/data/user";

export default async function TransactionsPage() {
  const data = await getUserData();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Users</p>
          <UsersFormDialog />
        </div>
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
