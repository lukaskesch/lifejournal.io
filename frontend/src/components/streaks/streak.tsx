import db from "@/db";
import {
  user_tags,
  user_time_log,
  user_time_log_has_tag,
  users,
} from "../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import {
  addDays,
  differenceInCalendarWeeks,
  differenceInDays,
  endOfWeek,
  startOfWeek,
} from "date-fns";
import { mySQLDateToDate } from "@/lib/date-utils";
import StreakClient from "./streak-client";

export default async function Streak({
  tagId,
  startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  endDate = new Date(),
}: {
  tagId: string;
  startDate?: Date;
  endDate?: Date;
}) {
  if (!db) return null;

  const tags = await db
    .select({
      tag: user_tags,
    })
    .from(user_tags)
    .where(eq(user_tags.id, tagId))
    .execute();

  const allLogsWithGivenTag = await db
    .select({
      log: user_time_log,
    })
    .from(user_time_log_has_tag)
    .where(eq(user_time_log_has_tag.tag_id, tagId))
    .innerJoin(
      user_time_log,
      eq(user_time_log.id, user_time_log_has_tag.user_time_log_id)
    )
    .orderBy(user_time_log.start_time)
    .execute();

  // Add two hours to the start and end dates to account for the timezone offset
  const startWeekStartDate = new Date(
    startOfWeek(startDate).getTime() + 2 * 60 * 60 * 1000
  );
  const tomorrow = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);

  const days = [];
  const numberOfDays = differenceInDays(tomorrow, startWeekStartDate);
  for (let i = 0; i < numberOfDays; i++) {
    const indexDate = addDays(startWeekStartDate, i);
    const beginningOfDay = new Date(
      Date.UTC(
        indexDate.getUTCFullYear(),
        indexDate.getUTCMonth(),
        indexDate.getUTCDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfDay = new Date(
      Date.UTC(
        indexDate.getUTCFullYear(),
        indexDate.getUTCMonth(),
        indexDate.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );
    days.push({
      date: endOfDay,
      logs: allLogsWithGivenTag.filter((log) => {
        if (!log.log.start_time) return false;
        const logDate = mySQLDateToDate(log.log.start_time);
        return logDate >= beginningOfDay && logDate <= endOfDay;
      }),
    });
  }

  // Streak calculation
  let streak = 0;
  let isPriorDayLogged = true;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    // console.log(day, i, isPriorDayLogged, streak);
    if (!isPriorDayLogged && !day.logs.length) {
      break;
    }
    if (day.logs.length > 0) {
      streak++;
      isPriorDayLogged = true;
    } else {
      isPriorDayLogged = false;
    }
  }

  // Intensity calculation
  const minutesPerDay = days
    .map((day) =>
      day.logs.reduce((acc, log) => acc + log.log.duration_minutes, 0)
    )
    .filter((minutes) => minutes > 0)
    .sort((a, b) => a - b);
  const percentile20th = minutesPerDay[Math.floor(minutesPerDay.length * 0.2)];
  const percentile40th = minutesPerDay[Math.floor(minutesPerDay.length * 0.4)];
  const percentile60th = minutesPerDay[Math.floor(minutesPerDay.length * 0.6)];
  const percentile80th = minutesPerDay[Math.floor(minutesPerDay.length * 0.8)];

  const totalHours = Math.floor(
    minutesPerDay.reduce((acc, minutes) => acc + minutes, 0) / 60
  );


  return (
    <StreakClient
      tag={tags[0].tag}
      days={days}
      totalHours={totalHours}
      streak={streak}
      percentiles={{
        percentile20th,
        percentile40th,
        percentile60th,
        percentile80th,
      }}
    />
  );
}
