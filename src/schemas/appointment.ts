import { APPOINTMENT_STATUS, LOCATION } from "@/data/constants";
import { startOfDay } from "date-fns";
import { z } from "zod";
import { ProcedureSchema } from "./admin/procedures";

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

export const AppointmentActionSchema = z
  .object({
    userId: z.string(),
    doctorId: z.string(),
    procedure: ProcedureSchema,
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
  location: z.enum(LOCATION),
  description: z.string().nullable(),
  status: z.enum(APPOINTMENT_STATUS),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
