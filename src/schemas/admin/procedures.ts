import { z } from "zod";

export const ProceduresArraySchema = z.array(
  z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    price: z.number(),
  }),
);

export const ProcedureSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number(),
});

export type Procedure = z.infer<typeof ProcedureSchema>;

export const ProcedureFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
});
