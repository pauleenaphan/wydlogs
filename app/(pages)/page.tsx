import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold tracking-tight">wydlogs</h1>
      <Link
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"
        href="/api/auth/signin"
      >
        Sign in with GitHub
      </Link>
    </main>
  );
}
