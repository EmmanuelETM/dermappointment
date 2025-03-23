import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { db } from "@/server/db";
import { type Specialty } from "@/schemas/admin/specialties";

async function getSpecialtyData(): Promise<Specialty[]> {
  return await db.query.specialties.findMany();
}

export default async function SpecialtiesPage() {
  const data = await getSpecialtyData();

  return (
    <>
      <div className="container mx-auto px-4">
        <p className="py-2 text-lg font-bold">Specialties</p>
        <DataTable columns={columns} data={data} filter="name" />
      </div>
    </>
  );
}
