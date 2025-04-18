import { DataTable } from "@/components/table/data-table";
import { columns } from "./columns";
import { getDoctorData } from "@/data/doctors";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";

export default async function DoctorsPage() {
  const user = await currentUser();
  if (!user || !user.id) {
    redirect("/login");
  }
  const data = await getDoctorData();
  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Doctors</p>
        </div>
        <DataTable columns={columns} data={data} filter="name" />
      </div>
    </>
  );
}
