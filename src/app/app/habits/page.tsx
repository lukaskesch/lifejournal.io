"use server";

import db from "@/db";
import { habit, habitCheck, users } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import DueHabitsClient from "@/components/habits/DueHabitsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function HabitsPage() {
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

  async function getDueHabits() {
    const allHabits = await db
      .select()
      .from(habit)
      .where(eq(habit.userId, user.id))
      .execute();

    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get start of current week (Monday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const weekStart = startOfWeek.toISOString().split('T')[0];
    
    // Get start of current month
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const dueHabits = [];

    for (const habitRecord of allHabits) {
      let periodStart: string;
      
      if (habitRecord.periodUnit === 'day') {
        periodStart = today;
      } else if (habitRecord.periodUnit === 'week') {
        periodStart = weekStart;
      } else {
        periodStart = monthStart;
      }

      // Check if there's a habit check for this period
      const checks = await db
        .select()
        .from(habitCheck)
        .where(
          and(
            eq(habitCheck.habitId, habitRecord.id),
            gte(habitCheck.datetime, periodStart)
          )
        )
        .execute();

      // Count checks in the current period
      const checkCount = checks.filter(check => {
        const checkDate = new Date(check.datetime);
        if (habitRecord.periodUnit === 'day') {
          return check.datetime === today;
        } else if (habitRecord.periodUnit === 'week') {
          return checkDate >= startOfWeek;
        } else {
          return checkDate >= new Date(monthStart);
        }
      }).length;

      // Habit is due if check count is less than target count
      if (checkCount < habitRecord.targetCount) {
        dueHabits.push(habitRecord);
      }
    }

    return dueHabits;
  }

  return (
    <div>
      <DueHabitsClient habits={await getDueHabits()} />
    </div>
  );
}
