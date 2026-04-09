"use server";

import { revalidatePath } from "next/cache";
import { getAppSession } from "@/lib/auth";
import { endOfDay, startOfDay } from "@/lib/date-utils";
import { prisma } from "@/lib/prisma";

import { incrementCategoryHours } from "./category";

export type GetLogsOptions = {
  from: Date;
  to: Date;
  id?: string;
};

async function requireUserId(): Promise<string | null> {
  const session = await getAppSession();
  if (!session?.user || !("id" in session.user)) return null;
  return session.user.id as string;
}

async function bumpCategoryAfterLog(userId: string, categoryName: string) {
  await incrementCategoryHours(userId, categoryName);
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
    await bumpCategoryAfterLog(userId, last.category);
    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath("/report");
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
  await bumpCategoryAfterLog(userId, category);
  revalidatePath("/dashboard");
  revalidatePath("/history");
  revalidatePath("/report");
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
  revalidatePath("/history");
  revalidatePath("/report");
}

export async function deleteLog(formData: FormData) {
  const userId = await requireUserId();
  if (!userId) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  let deleted = false;
  await prisma.$transaction(async (tx) => {
    const log = await tx.log.findFirst({ where: { id, userId } });
    if (!log) return;

    await tx.log.delete({ where: { id } });
    deleted = true;

    const cat = await tx.category.findUnique({
      where: { userId_name: { userId, name: log.category } },
    });
    if (cat && cat.hours > 0) {
      await tx.category.update({
        where: { userId_name: { userId, name: log.category } },
        data: { hours: { decrement: 1 } },
      });
    }
  });

  if (deleted) {
    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath("/report");
  }
}
