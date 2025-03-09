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
import LiveTimeLoggerClient from "@/components/logging/LiveTimeLoggerClient";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { UserTimeLogSelect } from "@/types/database-types";

export default async function LiveFocusLogPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  // headers();
  if (!email) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  async function handleLoggedFocus(focusLog: UserTimeLogSelect): Promise<string> {
    "use server";
    try {
      await db.insert(userTimeLog).values({
        ...focusLog,
      });
      return focusLog.id;
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

  async function addTagsToFocusLog(focusLogId: string, tagIds: string[]) {
    "use server";
    try {
      await db.insert(userTimeLogHasTag).values(
        tagIds.map((tagId) => ({
          id: uuidv4(),
          userTimeLogId: focusLogId,
          tagId: tagId,
        }))
      );
    } catch (error) {
      console.error("Error adding tags to focus log:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* {user.email} */}
      <LiveTimeLoggerClient
        user={user}
        loggedTimeCallback={handleLoggedFocus}
        addTagsToFocusLogCallback={addTagsToFocusLog}
        userTags={await getUserTags()}
      />
    </div>
  );
}
