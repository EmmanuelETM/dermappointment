import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { getAppointmentsData } from "@/data/appointments";
import { currentUser } from "@/lib/currentUser";
import { redirect } from "next/navigation";
import { popoverConfig } from "./popoverConfig";

export default async function ManageAppointmentsPage() {
  const user = await currentUser();

  if (!user || !user.doctorId) {
    redirect("/login");
  }

  const appointments = await getAppointmentsData("doctorId", user.doctorId);

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="py-2 text-2xl font-semibold text-gray-900 dark:text-white lg:text-3xl">
            Management
          </h1>
        </div>
        <DataTable
          columns={columns}
          data={appointments}
          filter="procedure"
          popoverConfig={popoverConfig}
        />
      </div>
    </>
  );
}
