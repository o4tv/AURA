import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = process.env.AUTH_EMAIL;
        const password = process.env.AUTH_PASSWORD;

        if (!email || !password) {
          return null;
          // throw new Error("Email and password are required.");
        }
        if (
          credentials?.email !== email ||
          credentials?.password !== password
        ) {
          // throw new Error("Invalid email or password.");
          return null;
        }

        return { id: email, email };
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
};

export function auth() {
  return getServerSession(authOptions);
}
