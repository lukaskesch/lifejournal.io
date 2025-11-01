import db from "@/db";
import {
  userTags,
  userTimeLog,
  userTimeLogHasTag,
} from "@/db/schema";
import { eq } from "drizzle-orm";
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
      tag: userTags,
    })
    .from(userTags)
    .where(eq(userTags.id, tagId))
    .execute();

  const allLogsWithGivenTag = await db
    .select({
      log: userTimeLog,
    })
    .from(userTimeLogHasTag)
    .where(eq(userTimeLogHasTag.tagId, tagId))
    .innerJoin(
      userTimeLog,
      eq(userTimeLog.id, userTimeLogHasTag.userTimeLogId)
    )
    .orderBy(userTimeLog.startTime)
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
        if (!log.log.startTime) return false;
        const logDate = mySQLDateToDate(log.log.startTime);
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
      day.logs.reduce((acc, log) => acc + log.log.durationMinutes, 0)
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
