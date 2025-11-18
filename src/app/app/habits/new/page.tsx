"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createHabit, getUserTags } from "../actions";
import { UserTagSelect } from "@/types/database-types";

export default function NewHabitPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [periodUnit, setPeriodUnit] = React.useState<"day" | "week" | "month">("day");
  const [targetCount, setTargetCount] = React.useState(1);
  const [tagId, setTagId] = React.useState<string>("");
  const [tags, setTags] = React.useState<UserTagSelect[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoadingTags, setIsLoadingTags] = React.useState(true);

  React.useEffect(() => {
    const callbackUrl = decodeURIComponent(
      window.location.search.split("callbackUrl=")[1] || ""
    );
    if (callbackUrl) {
      // Store callback URL for after creation
    }
  }, []);

  React.useEffect(() => {
    async function loadTags() {
      try {
        const userTags = await getUserTags();
        setTags(userTags);
      } catch (error) {
        console.error("Error loading tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    }
    loadTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createHabit({
        name,
        description: description.trim() || undefined,
        periodUnit,
        targetCount,
        tagId: tagId || undefined,
      });
      
      // Get callback URL from query params
      const callbackUrl = decodeURIComponent(
        window.location.search.split("callbackUrl=")[1] || "/app/habits"
      );
      router.push(callbackUrl);
    } catch (error) {
      console.error("Error creating habit:", error);
      alert("Failed to create habit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Create New Habit</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Habit Name *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Exercise, Read, Meditate"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this habit..."
              disabled={isSubmitting}
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="tag" className="block text-sm font-medium mb-2">
              Activity Tag (optional)
            </label>
            <Select
              value={tagId || "none"}
              onValueChange={(value) => setTagId(value === "none" ? "" : value)}
              disabled={isSubmitting || isLoadingTags}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingTags ? "Loading tags..." : "Select a tag"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="periodUnit" className="block text-sm font-medium mb-2">
                Period Unit *
              </label>
              <Select
                value={periodUnit}
                onValueChange={(value: "day" | "week" | "month") =>
                  setPeriodUnit(value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="targetCount" className="block text-sm font-medium mb-2">
                Target Count *
              </label>
              <Input
                id="targetCount"
                type="number"
                min="1"
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating..." : "Create Habit"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const callbackUrl = decodeURIComponent(
                  window.location.search.split("callbackUrl=")[1] || "/app/habits"
                );
                router.push(callbackUrl);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

