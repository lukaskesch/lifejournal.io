"use client";

import React from "react";
import { HabitSelect } from "@/types/database-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Toolbar from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import { checkHabit } from "@/app/app/habits/actions";
import { useRouter } from "next/navigation";

export default function DueHabitsClient({
  habits,
}: {
  habits: HabitSelect[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUrl = pathname;

  const handleCheck = async (habitId: string) => {
    await checkHabit(habitId);
    router.refresh();
  };

  return (
    <div className="flex flex-col m-2">
      <Toolbar>
        <div className="flex flex-row justify-between gap-3">
          <div className="">Due Habits: #{habits.length}</div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Link href="/app/habits/manage" className="hover:text-gray-300">
            Manage Habits
          </Link>
          <Link
            href={`/app/habits/new?callbackUrl=${encodeURIComponent(
              currentUrl
            )}`}
            className="cursor-pointer">
            <Button>Create Habit</Button>
          </Link>
        </div>
      </Toolbar>
      <div className="grid gap-4 m-2">
        {habits.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            All caught up! No habits due right now.
          </div>
        ) : (
          habits.map((habit) => (
            <DueHabitCard key={habit.id} habit={habit} onCheck={handleCheck} />
          ))
        )}
      </div>
    </div>
  );
}

function DueHabitCard({
  habit,
  onCheck,
}: {
  habit: HabitSelect;
  onCheck: (habitId: string) => void;
}) {
  function formatPeriodUnit(unit: string): string {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  }

  return (
    <div className="p-4 m-2 rounded-lg bg-slate-100 border border-slate-200">
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <div className="font-bold text-lg mb-1">{habit.name}</div>
          {habit.description && (
            <div className="text-gray-700 mb-2">{habit.description}</div>
          )}
          <div className="text-sm text-gray-600">
            Target: {habit.targetCount} per {formatPeriodUnit(habit.periodUnit)}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            onClick={() => onCheck(habit.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            Check Off
          </Button>
        </div>
      </div>
    </div>
  );
}

