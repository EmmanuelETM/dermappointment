import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
// import { popoverConfig } from "./popoverConfig";
import { db } from "@/server/db";
import { type Doctor } from "@/schemas/doctor";
import { getFullDoctor } from "@/data/doctor";

async function getDoctorData(): Promise<Doctor[]> {
  const data = await getFullDoctor();
  return data!.rows;
}

export default async function TransactionsPage() {
  const data = await getDoctorData();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Doctors</p>
          {/* <SpecialtiesDialog /> */}
        </div>
        <DataTable
          columns={columns}
          data={data}
          filter="name"
          // popoverConfig={popoverConfig}
        />
      </div>
    </>
  );
}
