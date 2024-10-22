"use server";

import db from "@/db";
import {
  user_tags,
  user_time_log,
  user_time_log_has_tag,
  users,
} from "../../../../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import RetroactiveLoggerClient from "@/components/logging/RetroactiveLoggerClient";
import { RetroactiveFocusLog } from "@/types/RetroactiveFocusLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function LiveFocusLogPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

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

  async function handleLoggedFocus(
    focusLog: RetroactiveFocusLog
  ): Promise<string> {
    "use server";
    try {
      const userTimeLogId = uuidv4();

      console.log(focusLog);

      await db.insert(user_time_log).values({
        id: userTimeLogId,
        ...focusLog,
      });

      await db.insert(user_time_log_has_tag).values(
        focusLog.tagIds.map((tagId) => ({
          id: uuidv4(),
          user_time_log_id: userTimeLogId,
          tag_id: tagId,
        }))
      );

      return userTimeLogId;
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
