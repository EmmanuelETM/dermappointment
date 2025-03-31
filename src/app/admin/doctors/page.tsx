import { DataTable } from "@/components/tables/data-table";
import { columns } from "./columns";
import { type Doctor } from "@/schemas/doctor";
import { getFullDoctor } from "@/data/doctors";

async function getDoctorData(): Promise<Doctor[]> {
  const data = await getFullDoctor();

  const flatData = data.map((doctor) => ({
    ...doctor,
    name: doctor.name ?? "",
    email: doctor.email ?? "",
    specialties:
      doctor.doctors?.doctorSpecialties?.map((ds) => ({
        id: ds.specialties.id,
        name: ds.specialties.name,
        description: ds.specialties.description,
      })) ?? [],
    procedures:
      doctor.doctors?.doctorProcedures?.map((ds) => ({
        id: ds.procedures.id,
        name: ds.procedures.name,
        description: ds.procedures.description,
        duration: ds.procedures.duration,
      })) ?? [],
  }));

  return flatData;
}

export default async function DoctorsPage() {
  const data = await getDoctorData();

  return (
    <>
      <div className="container mx-auto px-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="py-2 text-lg font-bold">Doctors</p>
          {/* <SpecialtiesDialog /> */}
        </div>
        <DataTable columns={columns} data={data} filter="name" />
      </div>
    </>
  );
}
