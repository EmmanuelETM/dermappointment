import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const SignUpSchema = z.object({
  name: z.string().min(1, {
    message: "First name is required",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  address: z.string(),
  gender: z.string(),
  image: z.string(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
