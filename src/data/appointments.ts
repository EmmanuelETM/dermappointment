"use server";

import { type Appointment } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointment } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

const getAppointments = async (
  filterKey: "doctorId" | "userId",
  id: string,
) => {
  const data = await db.query.appointment.findMany({
    where: and(
      eq(appointment[filterKey], id),
      eq(appointment.status, "Confirmed"),
    ),
    with: {
      doctors: {
        columns: {},
        with: {
          users: {
            columns: {
              name: true,
            },
          },
        },
      },
      patients: {
        columns: {
          name: true,
        },
      },
      procedures: {
        columns: {
          name: true,
        },
      },
    },
    columns: {
      id: true,
      startTime: true,
      endTime: true,
      location: true,
      description: true,
      status: true,
    },
  });

  return data;
};

export async function getAppointmentsData(
  filterKey: "doctorId" | "userId",
  id: string,
): Promise<Appointment[]> {
  const data = await getAppointments(filterKey, id);

  const flatten = data.map((appointment) => ({
    id: appointment.id,
    patient: appointment.patients?.name,
    doctor: appointment.doctors.users.name,
    procedure: appointment.procedures?.name,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    location: appointment.location,
    description: appointment.description,
    status: appointment.status,
  }));

  return flatten;
}
