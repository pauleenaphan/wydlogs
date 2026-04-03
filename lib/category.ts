"use server";

import { revalidatePath } from "next/cache";
import { getAppSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUserId(): Promise<string | null> {
  const session = await getAppSession();
  if (!session?.user || !("id" in session.user)) return null;
  return session.user.id as string;
}

export async function getCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

/** +1 `hours` on the user’s `Category` row for this name (upsert if missing). */
export async function incrementCategoryHours(
  userId: string,
  categoryName: string,
) {
  const name = categoryName.trim();
  if (!name) return;
  await prisma.category.upsert({
    where: {
      userId_name: { userId, name },
    },
    create: { userId, name, hours: 1 },
    update: { hours: { increment: 1 } },
  });
}

export async function createCategory(name: string) {
  const userId = await requireUserId();
  if (!userId) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  try {
    const category = await prisma.category.create({
      data: { userId, name: trimmed, hours: 0 },
    });
    revalidatePath("/dashboard");
    return category;
  } catch {
    return null;
  }
}

export async function updateCategory(id: string, name: string) {
  const userId = await requireUserId();
  if (!userId) return null;
  const trimmed = name.trim();
  if (!trimmed) return null;
  const existing = await prisma.category.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;
  if (existing.name === trimmed) return existing;

  try {
    const category = await prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: { name: trimmed },
      });
      await tx.log.updateMany({
        where: { userId, category: existing.name },
        data: { category: trimmed },
      });
      return updated;
    });
    revalidatePath("/dashboard");
    return category;
  } catch {
    return null;
  }
}

export async function deleteCategory(id: string) {
  const userId = await requireUserId();
  if (!userId) return false;
  const existing = await prisma.category.findFirst({
    where: { id, userId },
  });
  if (!existing) return false;
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dashboard");
  return true;
}
