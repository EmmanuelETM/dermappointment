import { z } from "zod";
import { DoctorSchema } from "./doctor";
import { ProcedureSchema } from "./admin/procedures";
import { startOfDay } from "date-fns";
import { AppointmentSchemaBase } from "./appointment";
import { LOCATION, LOCK_STATUS } from "@/data/constants";

export const AppointmentLockActionSchema = z
  .object({
    userId: z.string(),
    doctor: DoctorSchema,
    procedure: ProcedureSchema,
    date: z.date().min(startOfDay(new Date()), "Must be in the future"),
  })
  .merge(AppointmentSchemaBase);

export const AppointmentLockSchema = z.object({
  id: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  patient: z.string().nullable(),
  doctor: z.string().nullable(),
  procedure: z.string().nullable(),
  timezone: z.string().nullable(),
  location: z.enum(LOCATION),
  description: z.string().nullable(),
  status: z.enum(LOCK_STATUS),
  expires: z.date(),
});

export type AppointmentLock = z.infer<typeof AppointmentLockSchema>;
