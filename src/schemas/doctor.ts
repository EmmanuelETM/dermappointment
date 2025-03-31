import { z } from "zod";
import {
  DoctorProcedureSchema,
  ProcedureSchema,
} from "@/schemas/admin/procedures";
import {
  DoctorSpecialtiesSchema,
  SpecialtySchema,
} from "@/schemas/admin/specialties";

export const DoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  doctorId: z.string(),
  specialties: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    }),
  ),
  procedures: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      duration: z.number(),
    }),
  ),
});

export type Doctor = z.infer<typeof DoctorSchema>;

export const DoctorsArraySchema = z.array(DoctorSchema);
