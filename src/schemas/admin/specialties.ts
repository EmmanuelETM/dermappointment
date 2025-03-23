import { z } from "zod";

export const SpecialtySchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
});

export type Specialty = z.infer<typeof SpecialtySchema>;
