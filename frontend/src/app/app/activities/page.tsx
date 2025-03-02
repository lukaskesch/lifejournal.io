"use server";

import db from "@/db";
import {
  userTags,
  userTimeLog,
  userTimeLogHasTag,
  users,
} from "../../../types/schema";
import { eq } from "drizzle-orm/expressions";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";
import LogListClient from "@/components/logs/LogListClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Logs() {
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

  async function getUserLogsWithTags() {
    const result = await db
      .select({
        log: userTimeLog,
        tag: userTags,
      })
      .from(userTimeLogHasTag)
      .where(eq(userTimeLog.userId, user.id))
      .innerJoin(
        userTimeLog,
        eq(userTimeLog.id, userTimeLogHasTag.userTimeLogId)
      )
      .innerJoin(userTags, eq(userTags.id, userTimeLogHasTag.tagId))
      .execute();

    const logs = result.reduce((acc, { log, tag }) => {
      const existingLog = acc.find((item) => item.id === log.id);

      if (existingLog) {
        existingLog.tags.push(tag);
      } else {
        acc.push({
          ...log,
          tags: [tag],
        });
      }

      return acc;
    }, [] as FocusLogWithTags[]);
    return logs;
  }

  getUserLogsWithTags();

  return (
    <div>
      <LogListClient logsWithTags={await getUserLogsWithTags()} />
    </div>
  );
}
