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
  firstname: z.string().min(1, {
    message: "First name is required",
  }),
  lastname: z.string().min(1, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "Invalid Email",
  }),
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  confirm: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  birthday: z.string().date("Birth Date is required"),
  address: z.string(),
  phone: z.string().min(13, {
    message: "Enter a correct phone number",
  }),
  gender: z.string(),
});
