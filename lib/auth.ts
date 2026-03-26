import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value == null || value === "") {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: requireEnv("NEXTAUTH_SECRET"),
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id, // Adds id into the session object so we can access
        },
      };
    },
  },
  providers: [
    GithubProvider({
      clientId: requireEnv("GITHUB_ID"),
      clientSecret: requireEnv("GITHUB_SECRET"),
    }),
  ],
};

