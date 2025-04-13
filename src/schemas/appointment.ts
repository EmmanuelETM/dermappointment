import { APPOINTMENT_STATUS, LOCATION } from "@/data/constants";
import { startOfDay } from "date-fns";
import { z } from "zod";
import { ProcedureSchema } from "./admin/procedures";
import { DoctorSchema } from "./doctor";

export const AppointmentSchemaBase = z.object({
  startTime: z.date().min(new Date()),
  description: z.string().optional(),
  timezone: z.string().min(1, "Required"),
  location: z.enum(LOCATION),
});

export const AppointmentFormSchema = z
  .object({
    date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  })
  .merge(AppointmentSchemaBase);

export const EditAppointmentFormSchema = z
  .object({
    date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  })
  .merge(AppointmentSchemaBase);

export const EditAppointmentActionSchema = z
  .object({
    appointmentId: z.string(),
    doctorId: z.string(),
    procedure: ProcedureSchema,
  })
  .merge(EditAppointmentFormSchema);

export const AppointmentActionSchema = z
  .object({
    userId: z.string(),
    userName: z.string(),
    doctor: DoctorSchema,
    procedure: ProcedureSchema,
    paymentIntentId: z.string(),
    amount: z.string(),
    currency: z.string(),
    status: z.string(),
    date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  })
  .merge(AppointmentSchemaBase);

export const AppointmentSchema = z.object({
  id: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  patient: z.string().nullable(),
  doctor: z.string().nullable(),
  procedure: z.string().nullable(),
  timezone: z.string().nullable(),
  location: z.enum(LOCATION),
  description: z.string().nullable(),
  status: z.enum(APPOINTMENT_STATUS),
  createdAt: z.date(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const FullAppointmentSchema = z.object({
  id: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  timezone: z.string(),
  location: z.enum(LOCATION),
  description: z.string().nullable(),
  status: z.enum(APPOINTMENT_STATUS),
  createdAt: z.date(),
  doctors: z.object({
    id: z.string(),
    users: z.object({
      name: z.string().nullable(), // Puede ser null
    }),
  }),
  patients: z.object({
    id: z.string(),
    name: z.string().nullable(), // ← aquí está el fix
  }),
  procedures: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    duration: z.number(),
  }),
});

export type FullAppointment = z.infer<typeof FullAppointmentSchema>;
