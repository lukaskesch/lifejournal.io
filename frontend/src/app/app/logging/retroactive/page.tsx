"use server";

import { db } from "../../../../../db";
import {
  user_tags,
  user_time_log,
  user_time_log_has_tag,
  users,
} from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import { FocusLog } from "@/types/FocusLog";
import LiveTimeLoggerClient from "@/components/logging/LiveTimeLoggerClient";
import RetroactiveLoggerClient from "@/components/logging/RetroactiveLoggerClient";

export default async function LiveFocusLogPage() {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, "lukas.kesch@gmail.com"))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  async function handleLoggedFocus(focusLog: FocusLog): Promise<string> {
    "use server";
    try {
      const id = uuidv4();
      await db.insert(user_time_log).values({
        id: id,
        ...focusLog,
      });
      return id;
    } catch (error) {
      console.error("Error inserting user_time_log", error);
      throw new Error("Error while logging focus");
    }
  }

  async function getUserTags() {
    const userTags = await db
      .select()
      .from(user_tags)
      .where(eq(user_tags.user_id, user.id))
      .execute();
    return userTags;
  }

  async function addTagsToFocusLog(focusLogId: string, tagIds: string[]) {
    "use server";
    try {
      await db.insert(user_time_log_has_tag).values(
        tagIds.map((tagId) => ({
          id: uuidv4(),
          user_time_log_id: focusLogId,
          tag_id: tagId,
        })),
      );
    } catch (error) {
      console.error("Error adding tags to focus log:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* {user.email} */}
      <RetroactiveLoggerClient />
    </div>
  );
}
