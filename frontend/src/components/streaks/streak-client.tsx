"use client";

import React from "react";
import { UserTags, UserTimeLog } from "../../../drizzle/schema";

export default function StreakClient({
  tag,
  days,
  totalHours,
  streak,
  percentiles,
}: {
  tag: UserTags;
  days: {
    date: Date;
    logs: {
      log: UserTimeLog;
    }[];
  }[];
  totalHours: number;
  streak: number;
  percentiles: {
    percentile20th: number;
    percentile40th: number;
    percentile60th: number;
    percentile80th: number;
  };
}) {
  const [hoverDay, setHoverDay] = React.useState<string | undefined>(undefined);
  const tableWrapperRef = React.useRef<HTMLTableElement>(null);

  React.useLayoutEffect(() => {
    // Update the table's scroll position to the rightmost day of the streak
    if (tableWrapperRef.current) {
      tableWrapperRef.current.scrollLeft = tableWrapperRef.current?.scrollWidth;
    }
  }, []);

  function renderDayOfWeek(weekDayNumber: number) {
    console.log(days);
    return days.map(
      (day, index) =>
        index % 7 === weekDayNumber && (
          <td
            key={index}
            onMouseEnter={() => setHoverDay(`${weekDayNumber}-${index}`)}
            onMouseLeave={() => setHoverDay(undefined)}
            className={`w-4 h-4 rounded-sm m-[1.5px] relative ${getIntensityClass(
              day.logs.reduce((acc, log) => acc + log.log.duration_minutes, 0)
            )}`}>
            {hoverDay === `${weekDayNumber}-${index}` && (
              <div className="absolute top-[16px] z-50 left-0">
                {day.date.toLocaleDateString("de-DE")}
              </div>
            )}
          </td>
        )
    );
  }

  function getIntensityClass(minutes: number) {
    if (minutes === 0) return "bg-gray-300";
    if (minutes < percentiles.percentile20th) return "bg-green-300";
    if (minutes < percentiles.percentile40th) return "bg-green-400";
    if (minutes < percentiles.percentile60th) return "bg-green-500";
    if (minutes < percentiles.percentile80th) return "bg-green-600";
    return "bg-green-700";
  }

  return (
    <div>
      <h2>
        #{tag.name} ({totalHours}h, {streak}d)
      </h2>
      <div className={`overflow-x-auto`} ref={tableWrapperRef}>
        <table className="border-separate w-[1000px]">
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
    </div>
  );
}
