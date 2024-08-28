"use server";

import { db } from "../../../../db";
import {
  user_tags,
  user_time_log,
  user_time_log_has_tag,
  users,
} from "../../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";
import LogListClient from "@/components/logs/LogListClient";
import { headers } from "next/headers";
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
        log: user_time_log,
        tag: user_tags,
      })
      .from(user_time_log_has_tag)
      .where(eq(user_time_log.user_id, user.id))
      .innerJoin(
        user_time_log,
        eq(user_time_log.id, user_time_log_has_tag.user_time_log_id),
      )
      .innerJoin(user_tags, eq(user_tags.id, user_time_log_has_tag.tag_id))
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
