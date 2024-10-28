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

  const tag = await db
    .select({
      name: user_tags,
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
  console.log(startWeekStartDate, tomorrow);

  const days = [];
  const numberOfDays = differenceInDays(tomorrow, startWeekStartDate);
  // console.log(numberOfDays);
  let indexInLogArray = 0;
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

  // days.forEach((day) => {
  //   console.log(day.date, day.logs.length);
  // });

  const totalHours = Math.floor(
    days.reduce(
      (acc, day) =>
        acc + day.logs.reduce((acc, log) => acc + log.log.duration_minutes, 0),
      0
    ) / 60
  );

  let streak = 0;
  let isPriorDayLogged = true;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    console.log(day, i, isPriorDayLogged, streak);
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

  function renderDayOfWeek(weekDayNumber: number) {
    return days.map(
      (day, index) =>
        index % 7 === weekDayNumber && (
          <td
            key={index}
            className={`w-4 h-4 rounded-sm m-[1.5px] ${
              day.logs.length > 0 ? "bg-green-500" : "bg-gray-500"
            }`}>
            {/* {day.logs.length} */}
          </td>
        )
    );
  }

  return (
    <div>
      <h2>
        #{tag[0].name.name} ({totalHours}h, {streak}d)
      </h2>
      <table className="border-separate ">
        <tbody className="">
          <tr className="">
            <th></th>
            {renderDayOfWeek(0)}
          </tr>
          <tr>
            <th className="text-[0.5rem] pr-1">Mon</th>
            {renderDayOfWeek(1)}
          </tr>
          <tr>
            <th></th>
            {renderDayOfWeek(2)}
          </tr>
          <tr>
            <th className="text-[0.5rem] pr-1">Wed</th>
            {renderDayOfWeek(3)}
          </tr>
          <tr>
            <th></th>
            {renderDayOfWeek(4)}
          </tr>
          <tr>
            <th className="text-[0.5rem] pr-1">Fri</th>
            {renderDayOfWeek(5)}
          </tr>
          <tr>
            <th></th>
            {renderDayOfWeek(6)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
