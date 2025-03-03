import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
// import bcrypt from "bcrypt";
import { db } from "@/server/db";
import { accounts, users } from "@/server/db/schema";
import { getUserByEmail } from "@/data/user";

declare module "next-auth" {
  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          if (!user) return null;
          if (!user?.password) return null;

          console.log(user);
          console.log(user.password);
          console.log(password);

          // const passwordMatch = await bcrypt.compare(
          //   "123456123456",
          //   user.password,
          // );

          // console.log(passwordMatch);

          // if (passwordMatch) return user;
          return user;
        }

        return null;
      },
    }),
    GoogleProvider,
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
