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
  doctors: z.object({
    id: z.string(),
    doctorProcedures: z.array(DoctorProcedureSchema),
    doctorSpecialties: z.array(DoctorSpecialtiesSchema),
  }),
  specialties: z.array(SpecialtySchema),
  procedures: z.array(ProcedureSchema),
});

export type Doctor = z.infer<typeof DoctorSchema>;

export const DoctorsArraySchema = z.array(DoctorSchema);
