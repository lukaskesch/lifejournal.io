"use client";

import React from "react";
import { HabitSelect } from "@/types/database-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Toolbar from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import { deleteHabit } from "@/app/app/habits/actions";
import { useRouter } from "next/navigation";

export default function HabitsClient({
  habits,
}: {
  habits: HabitSelect[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUrl = pathname;

  const handleDelete = async (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      await deleteHabit(habitId);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col min-h-screen m-2">
      <Toolbar>
        <div className="flex flex-row justify-between gap-3">
          <div className="">Habits: #{habits.length}</div>
        </div>
        <div className="flex flex-row gap-4 items-center">
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
            No habits yet. Create your first habit to get started!
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}

function HabitCard({
  habit,
  onDelete,
}: {
  habit: HabitSelect;
  onDelete: (habitId: string) => void;
}) {
  function formatPeriodUnit(unit: string): string {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  }

  function formatCreatedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="p-4 m-2 rounded-lg bg-slate-100 border border-slate-200">
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <div className="font-bold text-lg mb-1">{habit.name}</div>
          {habit.description && (
            <div className="text-gray-700 mb-2">{habit.description}</div>
          )}
          <div className="flex flex-row gap-4 text-sm text-gray-600">
            <span>
              Target: {habit.targetCount} per {formatPeriodUnit(habit.periodUnit)}
            </span>
            <span>Created: {formatCreatedDate(habit.createdAt)}</span>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(habit.id)}
            className="text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

