"use server";

import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getFullDoctor = async () => {
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
