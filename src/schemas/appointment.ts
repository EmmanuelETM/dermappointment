import { APPOINTMENT_STATUS, LOCATION } from "@/data/constants";
import { z } from "zod";

export const AppointmentFormSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  description: z.string().optional(),
});

// export const appointment = createTable("appointment", {
//   id: varchar("id", { length: 255 })
//     .notNull()
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   userId: varchar("user_id", { length: 255 })
//     .notNull()
//     .references(() => users.id),
//   doctorId: varchar("doctor_id", { length: 255 })
//     .notNull()
//     .references(() => doctors.id),
//   procedureId: varchar("procedure_id", { length: 255 })
//     .notNull()
//     .references(() => procedures.id),
//   startTime: timestamp("start_time").notNull(),
//   endTime: timestamp("end_time").notNull(),
//   location: Location("location").notNull(),
//   description: text("description"),
//   status: status("status").default("Pending").notNull(),
//   createdAt,
//   updatedAt,
// });

export const AppointmentSchema = z.object({
  id: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  patient: z.string().nullable(),
  doctor: z.string().nullable(),
  procedure: z.string().nullable(),
  location: z.enum(LOCATION),
  description: z.string().nullable(),
  status: z.enum(APPOINTMENT_STATUS),
});

export type Appointment = z.infer<typeof AppointmentSchema>;
