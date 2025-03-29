import { z } from "zod";
import {
  DoctorSpecialtiesArraySchema,
  SpecialtyArraySchema,
} from "./admin/specialties";
import {
  DoctorProceduresArraySchema,
  ProceduresArraySchema,
} from "./admin/procedures";

export const FullDoctorSchema = z.object({
  userId: z.string(),
  doctorId: z.string(),
  name: z.string(),
  email: z.string(),
  specialties: SpecialtyArraySchema,
  procedures: ProceduresArraySchema,
});

export type Doctor = z.infer<typeof FullDoctorSchema>;

export const TestFullDoctor = z.object({
  userId: z.string(),
  doctorId: z.string(),
  name: z.string(),
  email: z.string(),
  specialties: DoctorSpecialtiesArraySchema,
  procedures: DoctorProceduresArraySchema,
});

export const DoctorSchema = z.object({
  userId: z.string(),
  doctorId: z.string(),
  name: z.string(),
  email: z.string(),
});

export const DoctorArraySchema = z.array(DoctorSchema);
