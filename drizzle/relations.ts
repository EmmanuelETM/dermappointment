import { relations } from "drizzle-orm/relations";
import { dermappointmentUsers, dermappointmentAccount } from "./schema";

export const dermappointmentAccountRelations = relations(dermappointmentAccount, ({one}) => ({
	dermappointmentUser: one(dermappointmentUsers, {
		fields: [dermappointmentAccount.userId],
		references: [dermappointmentUsers.id]
	}),
}));

export const dermappointmentUsersRelations = relations(dermappointmentUsers, ({many}) => ({
	dermappointmentAccounts: many(dermappointmentAccount),
}));