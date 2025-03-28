import { z } from "zod";

export const ProceduresSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  price: z
    .string()
    .transform((val) => Number(val))
    .nullable(),
});

export type Procedure = z.infer<typeof ProceduresSchema>;

export const ProcedureFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
});
