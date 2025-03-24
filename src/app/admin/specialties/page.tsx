import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { db } from "@/server/db";
import { type Specialty } from "@/schemas/admin/specialties";

import { SpecialtiesDialog } from "@/components/dialog/specialties";

async function getSpecialtyData(): Promise<Specialty[]> {
  return await db.query.specialties.findMany();
}

export default async function AdminSpecialtiesPage() {
  const data = await getSpecialtyData();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Specialties</p>
          <SpecialtiesDialog />
        </div>
        <DataTable columns={columns} data={data} filter="name" />
      </div>
    </>
  );
}
