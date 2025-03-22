"use server";

import db from "@/db";
import {
  userTags,
  userTimeLog,
  userTimeLogHasTag,
  users,
} from "../../../../../types/schema";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import RetroactiveLoggerClient from "@/components/logging/RetroactiveLoggerClient";
import { RetroactiveFocusLog } from "@/types/RetroactiveFocusLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function LiveFocusLogPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

  async function handleLoggedFocus(
    focusLog: RetroactiveFocusLog
  ): Promise<string> {
    "use server";
    try {
      const userTimeLogId = uuidv4();

      await db.insert(userTimeLog).values({
        id: userTimeLogId,
        ...focusLog,
      });

      await db.insert(userTimeLogHasTag).values(
        focusLog.tagIds.map((tagId) => ({
          id: uuidv4(),
          userTimeLogId,
          tagId,
        }))
      );

      return userTimeLogId;
    } catch (error) {
      console.error("Error inserting user_time_log", error);
      throw new Error("Error while logging focus");
    }
  }

  async function getUserTags() {
    const tags = await db
      .select()
      .from(userTags)
      .where(eq(userTags.userId, user.id))
      .execute();
    return tags;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <RetroactiveLoggerClient
        user={user}
        userTags={await getUserTags()}
        loggedFocusCallback={handleLoggedFocus}
      />
    </div>
  );
}
