import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { db } from "@/server/db";
import { type Specialty } from "@/schemas/admin/specialties";

import { SpecialtiesFormDialog } from "@/components/dialog/admin/specialties-form";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/currentUser";

async function getSpecialtyData(): Promise<Specialty[]> {
  return await db.query.specialties.findMany();
}

export default async function AdminSpecialtiesPage() {
  const user = await currentUser();

  if (!user || !user.isAdmin) {
    redirect("/login");
  }
  const data = await getSpecialtyData();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Specialties</p>
          <SpecialtiesFormDialog />
        </div>
        <DataTable columns={columns} data={data} filter="name" />
      </div>
    </>
  );
}
