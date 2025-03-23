import { ROLES } from "@/data/constants";
import { z } from "zod";

export const updateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(ROLES),
  newRole: z.enum(ROLES),
});
