import { z } from "zod";

export const SpecialtyArraySchema = z.array(
  z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
  }),
);

export const SpecialtySchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
});

export type Specialty = z.infer<typeof SpecialtySchema>;

export const SpecialtyFormSchema = z.object({
  name: z.string(),
  description: z.string(),
});

//testing stuff

export const DoctorSpecialtySchema = z.object({
  doctorId: z.string().nullable(),
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
});

export const DoctorSpecialtiesArraySchema = z.array(DoctorSpecialtySchema);
