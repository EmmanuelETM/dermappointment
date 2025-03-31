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

export const UsersFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  role: z.enum(ROLES),
  location: z.enum(LOCATION),
  gender: z.string(),
});
