import { LOCATION } from "@/data/constants";
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
  location: z.string(),
  gender: z.string(),
  image: z.string(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    password: z.string().min(8).optional().or(z.literal("")),
    newPassword: z.string().min(8).optional().or(z.literal("")),
    location: z.enum(LOCATION).optional(),
  })
  .refine(
    (data) => {
      if (data.password === "" && data.newPassword === "") return true;
      if (data.password && !data.newPassword) return false;
      return true;
    },
    {
      message: "New Password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.password === "" && data.newPassword === "") return true;
      if (!data.password && data.newPassword) return false;
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );
