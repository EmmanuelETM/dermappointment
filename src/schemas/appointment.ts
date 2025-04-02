import { APPOINTMENT_STATUS, LOCATION } from "@/data/constants";
import { z } from "zod";

export const AppointmentFormSchema = z.object({
  userId: z.string(),
  doctorId: z.string(),
  procedureId: z.string(),

  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  status: z.boolean().default(true),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be greater than 0")
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
});

export const AppointmentSchema = z.object({
  id: z.string().nullable(),
  startTime: z.date().nullable(),
  endTime: z.date().nullable(),
  patient: z.string().nullable(),
  doctor: z.string().nullable(),
  procedure: z.string().nullable(),
  location: z.enum(LOCATION).nullable(),
  description: z.string().nullable(),
  status: z.enum(APPOINTMENT_STATUS).nullable(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
