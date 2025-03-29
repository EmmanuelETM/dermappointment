import { z } from "zod";

export const ProcedureSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number(),
});

export const ProceduresArraySchema = z.array(ProcedureSchema);

export type Procedure = z.infer<typeof ProcedureSchema>;

export const ProcedureFormSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
});

//test

export const DoctorProcedureSchema = z.object({
  doctorId: z.string().nullable(),
  id: z.string().nullable(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  price: z.number(),
});

export const DoctorProceduresArraySchema = z.array(DoctorProcedureSchema);
