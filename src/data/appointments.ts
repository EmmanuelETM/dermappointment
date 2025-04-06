import { type Appointment } from "@/schemas/appointment";
import { db } from "@/server/db";
import { appointment } from "@/server/db/schema";
import { and, eq, gte, lte, ne } from "drizzle-orm";
import { type APPOINTMENT_STATUS } from "./constants";
import { format, toZonedTime } from "date-fns-tz";

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
  }));

  return flatten;
}

const getAppointments = async (
  filterKey: "doctorId" | "userId",
  id: string,
  status: (typeof APPOINTMENT_STATUS)[number],
) => {
  const data = await db.query.appointment.findMany({
    where: and(eq(appointment[filterKey], id), eq(appointment.status, status)),
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
    },
  });

  return data;
};

export async function getAppointmentsData(
  filterKey: "doctorId" | "userId",
  id: string,
  status: (typeof APPOINTMENT_STATUS)[number],
): Promise<Appointment[]> {
  const data = await getAppointments(filterKey, id, status);

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
    };
  });

  return flatten;
}
