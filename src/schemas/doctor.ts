import { z } from "zod";
import { ProcedureSchema } from "@/schemas/admin/procedures";
import { SpecialtySchema } from "@/schemas/admin/specialties";

export const DoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  doctorId: z.string(),
  specialties: z.array(SpecialtySchema),
  procedures: z.array(ProcedureSchema),
});

export type Doctor = z.infer<typeof DoctorSchema>;

export const DoctorsArraySchema = z.array(DoctorSchema);
