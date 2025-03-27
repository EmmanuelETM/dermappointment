import { ROLES } from "@/data/constants";
import { z } from "zod";

export const UsersFormSchema = z.object({
  name: z.string(),
  email: z.string().email({
    message: "Enter a valid Email!",
  }),
  password: z.string().min(8),
  role: z.enum(ROLES),
});
