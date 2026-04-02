"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { endOfDay, startOfDay } from "@/lib/date-utils";
import { prisma } from "@/lib/prisma";

export type GetLogsOptions = {
  from: Date;
  to: Date;
  id?: string;
};

async function requireUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user || !("id" in session.user)) return null;
  return session.user.id as string;
}

export async function createLogs(formData: FormData) {
  const userId = await requireUserId();
  if (!userId) return;

  const duplicate = formData.get("duplicateLast");
  if (duplicate === "1" || duplicate === "on") {
    const logs = await getLogs(userId, {
      from: startOfDay(),
      to: endOfDay(),
    });
    const last = logs[0];
    if (!last) return;
    await prisma.log.create({
      data: {
        ticketNumber: last.ticketNumber,
        category: last.category,
        user: { connect: { id: userId } },
      },
    });
    revalidatePath("/dashboard");
    return;
  }

  const ticketNumber = String(formData.get("ticketNumber") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!ticketNumber || !category) return;
  await prisma.log.create({
    data: {
      ticketNumber,
      category,
      user: { connect: { id: userId } },
    },
  });
  revalidatePath("/dashboard");
}

export async function getLogs(userId: string, options: GetLogsOptions) {
  return prisma.log.findMany({
    where: {
      userId,
      time: { gte: options.from, lte: options.to },
      ...(options.id ? { id: options.id } : {}),
    },
    orderBy: { time: "desc" },
  });
}

export async function editLogs(formData: FormData) {
  const userId = await requireUserId();
  if (!userId) return;
  const id = String(formData.get("id") ?? "");
  const ticketNumber = String(formData.get("ticketNumber") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  if (!id || !ticketNumber || !category) return;
  const existing = await prisma.log.findFirst({ where: { id, userId } });
  if (!existing) return;
  await prisma.log.update({
    where: { id },
    data: { ticketNumber, category },
  });
  revalidatePath("/dashboard");
}
