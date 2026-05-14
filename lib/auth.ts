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
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
  providers: [
    GithubProvider({
      clientId: requireEnv(process.env.NODE_ENV === 'development' ? 'GITHUB_ID_PROD' : 'GITHUB_ID_LOCAL'),
      clientSecret: requireEnv(process.env.NODE_ENV === 'development' ? 'GITHUB_SECRET_PROD' : 'GITHUB_SECRET_LOCAL'),
    }),
  ],
};

/** One session read per request when called from multiple server components / actions. */
export const getAppSession = cache(() => getServerSession(authOptions));

