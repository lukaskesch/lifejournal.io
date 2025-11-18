"use server";

import db from "@/db";
import { habit, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import HabitsClient from "@/components/habits/HabitsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function ManageHabitsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!user) {
    return null;
  }

  async function getUserHabits() {
    const habits = await db
      .select()
      .from(habit)
      .where(eq(habit.userId, user.id))
      .orderBy(desc(habit.createdAt))
      .execute();
    return habits;
  }

  return (
    <div>
      <HabitsClient habits={await getUserHabits()} />
    </div>
  );
}

