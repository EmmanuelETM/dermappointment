"use server";

import { DoctorSchema } from "@/schemas/doctor";
import { db } from "@/server/db";
import { sql } from "drizzle-orm";

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
                'price', p.price::TEXT  -- Convertimos price a string
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
    const parsedData = DoctorSchema.array().parse(data.rows);

    return { rows: parsedData };
  } catch {
    console.log("Error fetching full doctor");
  }
}
