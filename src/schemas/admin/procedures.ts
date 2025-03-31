import { z } from "zod";

export const ProcedureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  duration: z.number(),
});

export type Procedure = z.infer<typeof ProcedureSchema>;

export const ProcedureArraySchema = z.array(ProcedureSchema);

export const ProcedureFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  duration: z.string(),
});

export const DoctorProcedureSchema = z.object({
  procedures: ProcedureSchema,
});
