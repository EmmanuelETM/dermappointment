import { z } from "zod";
import { SpecialtySchema } from "./admin/specialties";
import { ProcedureSchema } from "./admin/procedures";

export const DoctorSchema = z.object({
  userId: z.string(),
  doctorId: z.string(),
  name: z.string(),
  email: z.string(),
  specialties: z.array(SpecialtySchema),
  procedures: z.array(ProcedureSchema),
});

export type Doctor = z.infer<typeof DoctorSchema>;
