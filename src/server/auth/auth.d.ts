import { type DefaultSession } from "next-auth";
import { type Roles } from "drizzle/schema";

export type ExtendedUser = DefaultSession["user"] & {
  role: Roles;
  address: string;
  gender: string;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: ExtendedUser;
  }
}
