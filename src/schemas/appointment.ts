import { z } from "zod";

export const appointmentFormSchema = z.object({
  userId: z.string(),
  doctorId: z.string(),
  procedureId: z.string(),

  name: z.string().min(1, "Required"),
  description: z.string().optional(),
  status: z.boolean().default(true),
  durationInMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be greater than 0")
    .max(60 * 12, `Duration must be less than 12 hours (${60 * 12} minutes)`),
});

// id: varchar("id", { length: 255 })
// .notNull()
// .primaryKey()
// .$defaultFn(() => crypto.randomUUID()),
// userId: varchar("user_id", { length: 255 })
// .notNull()
// .references(() => users.id),
// doctorId: varchar("doctor_id", { length: 255 })
// .notNull()
// .references(() => doctors.id),
// procedureId: varchar("procedure_id", { length: 255 })
// .notNull()
// .references(() => procedures.id),
// date: timestamp("date", { mode: "date" }),
// duration: integer("duration").notNull(),
// location: Location("location").notNull(),
// reason: text("reason"),
// status: varchar("status", { length: 20 }).notNull().default("pending"),
// createdAt,
// updatedAt,
