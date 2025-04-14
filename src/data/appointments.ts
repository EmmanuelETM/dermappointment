"use server";

import { type Appointment } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointments } from "@/server/db/schema";
import { and, eq, gt, gte, lt, lte, ne } from "drizzle-orm";
import { toZonedTime } from "date-fns-tz";

const getAppointmentSchedule = async (
  filterKey: "doctorId" | "userId",
  id: string,
  date: { start: Date; end: Date },
) => {
  const data = await db.query.appointments.findMany({
    where: and(
      eq(appointments[filterKey], id),
      and(
        ne(appointments.status, "Cancelled"),
        ne(appointments.status, "Completed"),
      ),
      gte(appointments.startTime, date.start),
      lte(appointments.endTime, date.end),
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
  const data = await db.query.appointments.findMany({
    where: eq(appointments[filterKey], id),
    orderBy: appointments.startTime,
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
    .filter((appointment) => appointment.status !== "Cancelled")
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

export const getAppointmentById = async (appointmentId: string) => {
  const data = await db.query.appointments.findFirst({
    where: eq(appointments.id, appointmentId),
    with: {
      doctors: {
        columns: {
          id: true,
        },
        with: {
          users: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      },
      patients: {
        columns: {
          id: true,
          name: true,
          email: true,
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

export async function getAppointmentByLockId(lockId: string) {
  const data = db.query.appointments.findFirst({
    where: eq(appointments.lockId, lockId),
    with: {
      doctors: {
        columns: {
          id: true,
        },
        with: {
          users: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      },
      patients: {
        columns: {
          id: true,
          name: true,
          email: true,
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
}

export async function getAppointmentsInRange(from: Date, to: Date) {
  return await db.query.appointments.findMany({
    where: and(
      eq(appointments.status, "Confirmed"),
      gt(appointments.startTime, from),
      lt(appointments.startTime, to),
    ),
    with: {
      doctors: {
        columns: {
          id: true,
        },
        with: {
          users: {
            columns: {
              name: true,
              email: true,
            },
          },
        },
      },
      patients: {
        columns: {
          id: true,
          name: true,
          email: true,
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
}
