import { LOCATION, ROLES } from "@/data/constants";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  role: z.enum(ROLES).nullable(),
  location: z.enum(LOCATION).nullable(),
});

export type User = z.infer<typeof UserSchema>;
