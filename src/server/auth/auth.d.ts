import { type DefaultSession } from "next-auth";
import { type Roles } from "drizzle/schema";

export type ExtendedUser = DefaultSession["user"] & {
  role: Roles;
  doctorId: string;
  address: string;
  gender: string;
  location: string;
  isOauth: boolean;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: ExtendedUser;
  }
}
