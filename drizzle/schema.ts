import {
  pgTable,
  varchar,
  text,
  timestamp,
  index,
  foreignKey,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["ADMIN", "PATIENT", "DOCTOR"]);

export enum Roles {
  ADMIN,
  PATIENT,
  DOCTOR,
}

export const dermappointmentUsers = pgTable("dermappointment_users", {
  id: varchar("id", { length: 255 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  role: userRole("role").default("PATIENT"),
  address: text("address"),
  gender: varchar("gender", { length: 128 }),
  emailVerified: timestamp("email_verified", {
    withTimezone: true,
    mode: "string",
  }),
  image: varchar("image", { length: 255 }),
});

export const dermappointmentAccount = pgTable(
  "dermappointment_account",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 255 }),
  },
  (table) => {
    return {
      accountUserIdIdx: index("account_user_id_idx").using(
        "btree",
        table.userId.asc().nullsLast(),
      ),
      dermappointmentAccountUserIdDermappointmentUsersIdFk: foreignKey({
        columns: [table.userId],
        foreignColumns: [dermappointmentUsers.id],
        name: "dermappointment_account_user_id_dermappointment_users_id_fk",
      }),
      dermappointmentAccountProviderProviderAccountIdPk: primaryKey({
        columns: [table.provider, table.providerAccountId],
        name: "dermappointment_account_provider_provider_account_id_pk",
      }),
    };
  },
);
