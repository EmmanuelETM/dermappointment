import { z } from "zod";

export const SpecialtySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
});

export type Specialty = z.infer<typeof SpecialtySchema>;

export const SpecialtiesArraySchema = z.array(SpecialtySchema);

export const SpecialtyFormSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const DoctorSpecialtiesSchema = z.object({
  specialties: SpecialtySchema,
});
