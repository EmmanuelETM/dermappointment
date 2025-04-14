import { type Doctor } from "@/schemas/doctor";
import { db } from "@/server/db";
import { doctors, schedule, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getDoctorId = async (userId: string) => {
  const doctorId = db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {},
    with: {
      doctors: {
        columns: {
          id: true,
        },
      },
    },
  });

  return doctorId;
};

export const getDoctorById = async (doctorId: string) => {
  const doctor = db.query.doctors.findFirst({
    where: eq(doctors.id, doctorId),
    columns: {},
    with: {
      users: {
        columns: {
          name: true,
          email: true,
        },
      },
    },
  });

  return doctor;
};

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

export async function getDoctorTimezone(doctorId: string) {
  const data = await db.query.schedule.findFirst({
    columns: {
      timezone: true,
    },
    where: eq(schedule.doctorId, doctorId),
  });

  return data;
}

export async function getDoctorEmailById(doctorId: string) {
  const data = await db.query.doctors.findFirst({
    where: eq(doctors.id, doctorId),
    columns: {},
    with: {
      users: {
        columns: {
          email: true,
        },
      },
    },
  });
  return { email: data?.users.email };
}
