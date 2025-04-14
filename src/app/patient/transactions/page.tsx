import { DataTable } from "@/components/table/data-table";
import { getUserTransactionsData } from "@/data/transactions";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { popoverConfig } from "./popoverConfig";

export default async function TransactionsPage() {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }

  const data = await getUserTransactionsData(user.id);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="py-2 text-2xl font-semibold text-gray-900 dark:text-white lg:text-3xl">
            Transactions
          </h1>
        </div>
        <DataTable
          columns={columns}
          data={data}
          filter="doctor"
          popoverConfig={popoverConfig}
        />
      </div>
    </>
  );
}
