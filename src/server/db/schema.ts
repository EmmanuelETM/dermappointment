import {
  APPOINTMENT_STATUS,
  DAYS_OF_WEEK,
  LOCATION,
  LOCK_STATUS,
  NOTIFICATION_STATUS,
  NOTIFICATION_TYPE,
  ROLES,
  SKIN_TYPES,
  TRANSACTION_TYPE,
} from "@/data/constants";
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  pgEnum,
  primaryKey,
  text,
  timestamp,
  varchar,
  boolean,
  time,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `dermappointment_${name}`);

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

// Users

export const UserRole = pgEnum("user_role", ROLES);
export const Location = pgEnum("location", LOCATION);

export const users = createTable("users", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  role: UserRole("role").default("PATIENT"),
  location: Location("location").default("La Vega"),
  gender: varchar("gender", { length: 128 }),
  // birthdate: timestamp("birthdate", { mode: "date" }),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }),
  image: varchar("image", { length: 255 }),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  doctors: one(doctors, {
    fields: [users.id],
    references: [doctors.userId],
  }),
  appointments: many(appointments),
  appointmentLocks: many(appointmentLock),
  payments: many(transactions),
  notificationLogs: many(notificationLogs),
  clinicalHistory: one(clinicalHistory, {
    fields: [users.id],
    references: [clinicalHistory.userId],
  }),
  participant: many(participant),
  messages: many(messages),
}));

//Auth Tables

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: text("identifier")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    // Sólo una clave primaria compuesta
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const passwordResetTokens = createTable(
  "passwordResetToken",
  {
    identifier: text("identifier")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar("email", { length: 255 }).notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

//Doctors

export const doctors = createTable("doctors", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt,
});

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  users: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  appointmentLocks: many(appointmentLock),
  doctorSpecialties: many(doctorSpecialties),
  doctorProcedures: many(doctorProcedures),
}));

//Specialties

export const specialties = createTable("specialties", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
});

export const specialtiesRelations = relations(specialties, ({ many }) => ({
  doctorSpecialties: many(doctorSpecialties),
}));

//Doctor => Specialties

export const doctorSpecialties = createTable("doctor_specialties", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  doctorId: varchar("doctor_id", { length: 255 })
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  specialtyId: varchar("specialty_id", { length: 255 })
    .notNull()
    .references(() => specialties.id, { onDelete: "cascade" }),
});

export const doctorSpecialtiesRelations = relations(
  doctorSpecialties,
  ({ one }) => ({
    doctors: one(doctors, {
      fields: [doctorSpecialties.doctorId],
      references: [doctors.id],
    }),
    specialties: one(specialties, {
      fields: [doctorSpecialties.specialtyId],
      references: [specialties.id],
    }),
  }),
);

//Procedures

export const procedures = createTable("procedures", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(),
});

export const proceduresRelations = relations(procedures, ({ many }) => ({
  doctorProcedures: many(doctorProcedures),
  appointments: many(appointments),
}));

// Doctor => Procedures

export const doctorProcedures = createTable("doctor_procedures", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  doctorId: varchar("doctor_id", { length: 255 })
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  procedureId: varchar("procedure_id", { length: 255 })
    .notNull()
    .references(() => procedures.id, { onDelete: "cascade" }),
});

export const doctorProceduresRelations = relations(
  doctorProcedures,
  ({ one }) => ({
    doctors: one(doctors, {
      fields: [doctorProcedures.doctorId],
      references: [doctors.id],
    }),
    procedures: one(procedures, {
      fields: [doctorProcedures.procedureId],
      references: [procedures.id],
    }),
  }),
);

// appointment

export const status = pgEnum("status", APPOINTMENT_STATUS);

export const appointments = createTable("appointments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  doctorId: varchar("doctor_id", { length: 255 })
    .notNull()
    .references(() => doctors.id),
  procedureId: varchar("procedure_id", { length: 255 })
    .notNull()
    .references(() => procedures.id),
  lockId: varchar("lock_id", { length: 255 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  timezone: text("timezone").notNull(),
  location: Location("location").notNull(),
  description: text("description"),
  status: status("status").default("Pending").notNull(),
  createdAt,
  updatedAt,
});

export const appointmentsRelations = relations(
  appointments,
  ({ one, many }) => ({
    patients: one(users, {
      fields: [appointments.userId],
      references: [users.id],
    }),
    doctors: one(doctors, {
      fields: [appointments.doctorId],
      references: [doctors.id],
    }),
    procedures: one(procedures, {
      fields: [appointments.procedureId],
      references: [procedures.id],
    }),
    payments: many(transactions),
  }),
);

export const lockStatus = pgEnum("lock_status", LOCK_STATUS);

export const appointmentLock = createTable("appointment_lock", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  doctorId: varchar("doctor_id", { length: 255 })
    .notNull()
    .references(() => doctors.id),
  procedureId: varchar("procedure_id", { length: 255 })
    .notNull()
    .references(() => procedures.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  timezone: text("timezone").notNull(),
  location: Location("location").notNull(),
  description: text("description"),
  status: lockStatus("status").default("Pending").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const appointmentLockRelations = relations(
  appointmentLock,
  ({ one }) => ({
    patients: one(users, {
      fields: [appointmentLock.userId],
      references: [users.id],
    }),
    doctors: one(doctors, {
      fields: [appointmentLock.doctorId],
      references: [doctors.id],
    }),
    procedures: one(procedures, {
      fields: [appointmentLock.procedureId],
      references: [procedures.id],
    }),
  }),
);

//payment

export const transactionType = pgEnum("transaction_type", TRANSACTION_TYPE);

export const transactions = createTable("transactions", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  stripeId: text("stripeId").notNull().unique(),
  appointmentId: varchar("appointment_id", { length: 255 })
    .notNull()
    .references(() => appointments.id),
  type: transactionType("type").notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 128 }).notNull(),
  status: varchar("status", { length: 255 }).notNull(),
  createdAt,
  updatedAt,
});

export const paymentsRelations = relations(transactions, ({ one }) => ({
  appointment: one(appointments, {
    fields: [transactions.appointmentId],
    references: [appointments.id],
  }),
  users: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

//schedule

export const schedule = createTable("schedule", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  timezone: text("timezone").notNull(),
  doctorId: varchar("doctor_id", { length: 255 })
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" })
    .unique(),
  createdAt,
  updatedAt,
});

export const scheduleRelations = relations(schedule, ({ one, many }) => ({
  doctors: one(doctors, {
    fields: [schedule.doctorId],
    references: [doctors.id],
  }),
  scheduleAvailability: many(scheduleAvailability),
}));

export const WeekDays = pgEnum("week_days", DAYS_OF_WEEK);

export const scheduleAvailability = createTable(
  "schedule_availability",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    scheduleId: varchar("schedule_id", { length: 255 })
      .notNull()
      .references(() => schedule.id, { onDelete: "cascade" }),
    location: Location("location").default("La Vega").notNull(),
    weekDay: WeekDays("week_day").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    scheduleIdIndx: index("scheduleIdIndex").on(table.scheduleId),
  }),
);

export const scheduleAvailabilityRelations = relations(
  scheduleAvailability,
  ({ one }) => ({
    schedule: one(schedule, {
      fields: [scheduleAvailability.scheduleId],
      references: [schedule.id],
    }),
  }),
);

// notifications

export const notificationType = pgEnum("notification_type", NOTIFICATION_TYPE);
export const notificationStatus = pgEnum(
  "notification_status",
  NOTIFICATION_STATUS,
);

export const notificationLogs = createTable("notification_logs", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  type: notificationType("notification_type").notNull(),
  content: text("content").notNull(),
  status: notificationStatus("notification_status")
    .notNull()
    .default("Pending"),
  error: text("error"),
  createdAt,
  updatedAt,
});

export const notificationLogsRelations = relations(
  notificationLogs,
  ({ one }) => ({
    users: one(users, {
      fields: [notificationLogs.userId],
      references: [users.id],
    }),
  }),
);

// clinical history

export const SkinType = pgEnum("skin_type", SKIN_TYPES);

//clinical history

export const clinicalHistory = createTable("clinical_history", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  dermatologicBackground: text("dermatologic_background"),
  skinType: SkinType("skin_type").default("Normal"),
  alergies: text("alergies"),
  sunExposure: boolean("sun_exposure").default(false),
  sunscreen: boolean("sunscreen").default(false),
  smokes: boolean("smokes").default(false),
  alcohol: boolean("alcohol").default(false),
  drugs: boolean("drugs").default(false),
  diet: text("diet"),
  stress: boolean("stress").default(false),
  medicine: text("medicine"),
  chronicDiseases: text("chronic_diseases"),
  skinInjuries: text("skinInjuries"),
  itches: boolean("itches").default(false),
  skinPeels: boolean("skin_peels").default(false),
  erythema: boolean("erythema").default(false),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  monitoring: text("monitoring"),
  createdAt,
  updatedAt,
});

export const clinicalHistoryRelations = relations(
  clinicalHistory,
  ({ one }) => ({
    patients: one(users, {
      fields: [clinicalHistory.userId],
      references: [users.id],
    }),
  }),
);

// chat stuff

export const participant = createTable("participant", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 }).notNull(),
  conversationId: varchar("conversation_id", { length: 255 }).notNull(),
});

export const participantRelations = relations(participant, ({ one }) => ({
  users: one(users, {
    fields: [participant.userId],
    references: [users.id],
  }),
  conversation: one(conversation, {
    fields: [participant.conversationId],
    references: [conversation.id],
  }),
}));

//conversation

export const conversation = createTable("conversation", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  lastSenderId: varchar("last_sender_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt,
});

export const conversationRelations = relations(conversation, ({ many }) => ({
  participant: many(participant),
  messages: many(messages),
}));

//messages

export const messages = createTable("messages", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  conversationId: varchar("conversation_id", { length: 255 })
    .notNull()
    .references(() => conversation.id),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  createdAt,
});

export const messagesRelations = relations(messages, ({ one }) => ({
  users: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  conversation: one(conversation, {
    fields: [messages.conversationId],
    references: [conversation.id],
  }),
}));

//Payment stuff
