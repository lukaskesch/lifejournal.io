'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { eq, and } from "drizzle-orm";
import { users, habit } from "@/db/schema";
import db from "@/db";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";

async function getUserFromSession() {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function createHabit(data: {
  name: string;
  description?: string;
  periodUnit: 'day' | 'week' | 'month';
  targetCount: number;
  daysOfWeekMask?: number;
}) {
  if (!data.name.trim()) {
    throw new Error("Habit name is required");
  }

  const user = await getUserFromSession();

  if (!db) {
    throw new Error("Database not initialized");
  }

  await db.insert(habit).values({
    id: uuidv4(),
    userId: user.id,
    name: data.name.trim(),
    description: data.description?.trim() || null,
    periodUnit: data.periodUnit,
    targetCount: data.targetCount,
    daysOfWeekMask: data.daysOfWeekMask || null,
  });

  revalidatePath('/app/habits');
}

async function verifyHabitOwnership(habitId: string, userId: string) {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const habitRecord = await db
    .select()
    .from(habit)
    .where(and(eq(habit.id, habitId), eq(habit.userId, userId)))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!habitRecord) {
    throw new Error("Habit not found or unauthorized");
  }

  return habitRecord;
}

export async function deleteHabit(habitId: string) {
  const user = await getUserFromSession();

  if (!db) {
    throw new Error("Database not initialized");
  }

  await verifyHabitOwnership(habitId, user.id);

  await db
    .delete(habit)
    .where(
      and(
        eq(habit.id, habitId),
        eq(habit.userId, user.id)
      )
    )
    .execute();

  revalidatePath('/app/habits');
}

export async function updateHabit(habitId: string, data: {
  name: string;
  description?: string;
  periodUnit: 'day' | 'week' | 'month';
  targetCount: number;
  daysOfWeekMask?: number;
}) {
  if (!data.name.trim()) {
    throw new Error("Habit name is required");
  }

  const user = await getUserFromSession();

  if (!db) {
    throw new Error("Database not initialized");
  }

  await verifyHabitOwnership(habitId, user.id);

  await db
    .update(habit)
    .set({
      name: data.name.trim(),
      description: data.description?.trim() || null,
      periodUnit: data.periodUnit,
      targetCount: data.targetCount,
      daysOfWeekMask: data.daysOfWeekMask || null,
    })
    .where(and(eq(habit.id, habitId), eq(habit.userId, user.id)))
    .execute();

  revalidatePath('/app/habits');
}

