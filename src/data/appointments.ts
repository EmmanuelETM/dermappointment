"use server";

import { type Appointment } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointment } from "@/server/db/schema";
import { and, eq, gte, lte, ne } from "drizzle-orm";
import { toZonedTime } from "date-fns-tz";

const getAppointmentSchedule = async (
  filterKey: "doctorId" | "userId",
  id: string,
  date: { start: Date; end: Date },
) => {
  const data = await db.query.appointment.findMany({
    where: and(
      eq(appointment[filterKey], id),
      and(
        ne(appointment.status, "Cancelled"),
        ne(appointment.status, "Completed"),
      ),
      gte(appointment.startTime, date.start),
      lte(appointment.endTime, date.end),
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
      timezone: true,
      location: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  return data;
};

export async function getAppointmentScheduleData(
  filterKey: "doctorId" | "userId",
  id: string,
  date: { start: Date; end: Date },
): Promise<Appointment[]> {
  const data = await getAppointmentSchedule(filterKey, id, date);

  const flatten = data.map((appointment) => ({
    id: appointment.id,
    patient: appointment.patients?.name,
    doctor: appointment.doctors.users.name,
    procedure: appointment.procedures?.name,
    startTime: appointment.startTime,
    endTime: appointment.endTime,
    timezone: appointment.timezone,
    location: appointment.location,
    description: appointment.description,
    status: appointment.status,
    createdAt: appointment.createdAt,
  }));

  return flatten;
}

const getAppointments = async (
  filterKey: "doctorId" | "userId",
  id: string,
) => {
  const data = await db.query.appointment.findMany({
    where: eq(appointment[filterKey], id),
    orderBy: appointment.startTime,
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
      timezone: true,
      location: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  return data;
};

export async function getAppointmentsData(
  filterKey: "doctorId" | "userId",
  id: string,
): Promise<Appointment[]> {
  const data = await getAppointments(filterKey, id);

  const flatten = data.map((appointment) => {
    const start = toZonedTime(appointment.startTime, appointment.timezone);
    const end = toZonedTime(appointment.endTime, appointment.timezone);

    return {
      id: appointment.id,
      patient: appointment.patients?.name,
      doctor: appointment.doctors.users.name,
      procedure: appointment.procedures?.name,
      startTime: start,
      endTime: end,
      timezone: appointment.timezone,
      location: appointment.location,
      description: appointment.description,
      status: appointment.status,
      createdAt: appointment.createdAt,
    };
  });

  return flatten;
}

export async function getActiveAppointmentsData(
  filterKey: "doctorId" | "userId",
  id: string,
): Promise<Appointment[]> {
  const data = await getAppointments(filterKey, id);

  const flatten = data
    .filter(
      (appointment) =>
        appointment.status === "Pending" || appointment.status === "Confirmed",
    )
    .map((appointment) => {
      const start = toZonedTime(appointment.startTime, appointment.timezone);
      const end = toZonedTime(appointment.endTime, appointment.timezone);

      return {
        id: appointment.id,
        patient: appointment.patients?.name,
        doctor: appointment.doctors.users.name,
        procedure: appointment.procedures?.name,
        startTime: start,
        endTime: end,
        timezone: appointment.timezone,
        location: appointment.location,
        description: appointment.description,
        status: appointment.status,
        createdAt: appointment.createdAt,
      };
    });

  return flatten;
}

export const getSingleAppointment = async (appointmentId: string) => {
  const data = await db.query.appointment.findFirst({
    where: eq(appointment.id, appointmentId),
    with: {
      doctors: {
        columns: {
          id: true,
        },
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
          id: true,
          name: true,
        },
      },
      procedures: true,
    },
    columns: {
      id: true,
      startTime: true,
      endTime: true,
      timezone: true,
      location: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  return data;
};
