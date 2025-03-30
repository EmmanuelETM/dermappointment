"use server";

import {
  DoctorProceduresArraySchema,
  ProceduresArraySchema,
} from "@/schemas/admin/procedures";
import {
  DoctorSpecialtiesArraySchema,
  SpecialtyArraySchema,
} from "@/schemas/admin/specialties";
import {
  DoctorArraySchema,
  DoctorSchema,
  FullDoctorSchema,
} from "@/schemas/doctor";
import { db } from "@/server/db";
import {
  doctorProcedures,
  doctors,
  doctorSpecialties,
  procedures,
  specialties,
  users,
} from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";

export async function getFullDoctor() {
  const query = sql`
    SELECT
        U.id AS "userId",
        D.id AS "doctorId",
        U.name,
        U.email,
        ARRAY_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'id', p.id,
                'name', p.name,
                'description', p.description,
                'price', p.price
            )
        ) AS procedures,
        ARRAY_AGG(
            DISTINCT JSONB_BUILD_OBJECT(
                'id', s.id,
                'name', s.name,
                'description', s.description
            )
        ) AS specialties
    FROM
        dermappointment_doctors D
        JOIN dermappointment_users U ON D.user_id = U.id
        JOIN dermappointment_doctor_procedures DP ON D.id = DP.doctor_id
        JOIN dermappointment_procedures P ON DP.procedure_id = P.id
        JOIN dermappointment_doctor_specialties DS ON D.id = DS.doctor_id
        JOIN dermappointment_specialties S ON DS.specialty_id = S.id
    GROUP BY
        D.id, U.id;
  `;

  try {
    const data = await db.execute(query);
    const parsedData = FullDoctorSchema.array().parse(data.rows);
    return { rows: parsedData };
  } catch (error) {
    console.log(`Error fetching full doctor: ${String(error)}`);
  }
}

async function fetchAllDoctors() {
  try {
    const result = await db
      .select({
        userId: users.id,
        doctorId: doctors.id,
        name: users.name,
        email: users.email,
      })
      .from(doctors)
      .innerJoin(users, eq(doctors.userId, users.id));

    const parsed = DoctorArraySchema.parse(result);

    return parsed;
  } catch (error) {
    console.log(`Error fetching doctors: ${String(error)}`);
  }
}

async function fetchAllProcedures() {
  try {
    const result = await db
      .select({
        doctorId: doctorProcedures.doctorId,
        id: specialties.id,
        name: procedures.name,
        description: procedures.description,
        price: procedures.price,
      })
      .from(doctorProcedures)
      .innerJoin(procedures, eq(doctorProcedures.procedureId, procedures.id));
    return result;
  } catch (error) {
    console.log(`Error fetching procedures: ${String(error)}`);
  }
}

async function fetchAllSpecialties() {
  try {
    const result = await db
      .select({
        doctorId: doctorSpecialties.doctorId,
        id: specialties.id,
        name: specialties.name,
        description: specialties.description,
      })
      .from(doctorSpecialties)
      .innerJoin(
        specialties,
        eq(doctorSpecialties.specialtyId, specialties.id),
      );
    return result;
  } catch (error) {
    console.log(`Error fetching specialties: ${String(error)}`);
  }
}

const combineDoctorData = (
  doctorData: typeof DoctorArraySchema,
  proceduresData: typeof DoctorProceduresArraySchema,
  specialtiesData: typeof DoctorSpecialtiesArraySchema,
) => {
  const vDoctorData = DoctorArraySchema.parse(doctorData);
  const vProceduresData = DoctorProceduresArraySchema.parse(proceduresData);
  const vSpecialtiesData = DoctorSpecialtiesArraySchema.parse(specialtiesData);

  return vDoctorData.map((doctor) => {
    const doctorProcedures = vProceduresData.filter(
      (procedure) => procedure.doctorId === doctor.doctorId,
    );

    const doctorSpecialties = vSpecialtiesData.filter(
      (specialty) => specialty.doctorId === doctor.doctorId,
    );

    return {
      userId: doctor.userId,
      doctorId: doctor.doctorId,
      name: doctor.name,
      email: doctor.email,
      procedures: doctorProcedures.map((procedure) => ({
        id: procedure.id,
        name: procedure.name,
        description: procedure.description,
        price: procedure.price,
      })),
      specialties: doctorSpecialties.map((specialty) => ({
        id: specialty.id,
        name: specialty.name,
        description: specialty.description,
      })),
    };
  });
};

const realDoctorshi = async () => {
  return await db.query.doctors.findMany({
    with: {
      doctorSpecialties: {
        with: {
          specialties: true,
        },
      },
      doctorProcedures: {
        with: {
          procedures: true,
        },
      },
    },
  });
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
