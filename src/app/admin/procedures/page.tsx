import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { db } from "@/server/db";
import { type Procedure } from "@/schemas/admin/procedures";
import { ProceduresFormDialog } from "@/components/dialog/admin/procedures-form";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

async function getProceduresData(): Promise<Procedure[]> {
  return await db.query.procedures.findMany();
}

export default async function AdminProceduresPage() {
  const user = await currentUser();

  if (!user || !user.isAdmin) {
    redirect("/login");
  }
  const data = await getProceduresData();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Procedures</p>
          <ProceduresFormDialog />
        </div>
        <DataTable columns={columns} data={data} filter="name" />
      </div>
    </>
  );
}
