import { z } from "zod";
import { DoctorProcedureSchema } from "@/schemas/admin/procedures";
import { DoctorSpecialtiesSchema } from "@/schemas/admin/specialties";

export const DoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  doctors: z.object({
    id: z.string(),
    doctorProcedures: z.array(DoctorProcedureSchema),
    doctorSpecialties: z.array(DoctorSpecialtiesSchema),
  }),
});

export type Doctor = z.infer<typeof DoctorSchema>;

export const DoctorsArraySchema = z.array(DoctorSchema);
