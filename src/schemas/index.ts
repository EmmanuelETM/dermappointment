import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
