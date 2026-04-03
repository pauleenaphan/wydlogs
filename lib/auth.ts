import { cache } from "react";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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
      const logCount =
        "logCount" in user && typeof user.logCount === "number"
          ? user.logCount
          : 0;
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          logCount,
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

/** One session read per request when called from multiple server components / actions. */
export const getAppSession = cache(() => getServerSession(authOptions));

