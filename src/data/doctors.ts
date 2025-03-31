"use server";

import { type Doctor } from "@/schemas/doctor";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const getFullDoctor = async () => {
  const data = db.query.users.findMany({
    where: eq(users.role, "DOCTOR"),
    columns: {
      id: true,
      name: true,
      email: true,
    },
    with: {
      doctors: {
        columns: {
          id: true,
        },
        with: {
          doctorSpecialties: {
            columns: {
              id: false,
              doctorId: false,
              specialtyId: false,
            },
            with: {
              specialties: true,
            },
          },
          doctorProcedures: {
            columns: {
              id: false,
              doctorId: false,
              procedureId: false,
            },
            with: {
              procedures: true,
            },
          },
        },
      },
    },
  });

  return data;
};

export async function getDoctorData(): Promise<Doctor[]> {
  const data = await getFullDoctor();

  const flatDoctor = data.map((doctor) => ({
    id: doctor.id,
    name: doctor.name ?? "",
    email: doctor.email ?? "",
    doctorId: doctor.doctors?.id ?? "",
    specialties:
      doctor.doctors?.doctorSpecialties?.map((ds) => ({
        id: ds.specialties.id,
        name: ds.specialties.name,
        description: ds.specialties.description,
      })) ?? [],
    procedures:
      doctor.doctors?.doctorProcedures?.map((dp) => ({
        id: dp.procedures.id,
        name: dp.procedures.name,
        description: dp.procedures.description,
        duration: dp.procedures.duration,
      })) ?? [],
  }));

  return flatDoctor;
}

// const getAllDoctors = async () => {
//   const doctorData = await fetchAllDoctors();
//   const proceduresData = await fetchAllProcedures();
//   const specialtiesData = await fetchAllSpecialties();

//   const combinedDoctorData = combineDoctorData(
//     doctorData,
//     proceduresData,
//     specialtiesData,
//   );

//   return combinedDoctorData;
// };
