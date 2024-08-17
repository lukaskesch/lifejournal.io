"use client";

import React from "react";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";
import { TimeLoggedChart } from "./TimeLoggedChart";

export default function LogListClient({
  logsWithTags,
}: {
  logsWithTags: FocusLogWithTags[];
}) {
  logsWithTags.sort((a, b) => {
    if (!a.start_time || !b.start_time) {
      return 0;
    }
    if (a.start_time < b.start_time) {
      return 1;
    }
    if (a.start_time > b.start_time) {
      return -1;
    }
    return 0;
  });
  return (
    <div className="flex flex-col min-h-screen">
      <div className="mr-4 my-4">
        <TimeLoggedChart logsWithTags={logsWithTags} />
      </div>
      {logsWithTags.map((log) => (
        <Log key={log.id} log={log} />
      ))}
    </div>
  );
}

function Log({ log }: { log: FocusLogWithTags }) {
  function formatOutputTime(mysqlDateTime: string | null): string {
    if (!mysqlDateTime) {
      return "";
    }
    const date = new Date(mysqlDateTime);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function formatOutputDate(mysqlDateTime: string | null): string {
    if (!mysqlDateTime) {
      return "";
    }
    const date = new Date(mysqlDateTime);
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return `${dayOfWeek}, ${day} ${month}`;
  }

  const timespanString = `${formatOutputTime(log.start_time)} - ${formatOutputTime(log.end_time)}`;

  return (
    <div className="border p-2 m-2">
      <div className="font-bold">{log.duration_minutes + " minutes"}</div>
      <div className="flex flex-row ">
        <div>{formatOutputDate(log.start_time)}</div>
        <div>{": " + timespanString}</div>
      </div>
      {/* <div>{log.id}</div> */}
      <div>{log.description}</div>
      <div>{log.tags.map((tag) => tag.name).join(", ")}</div>
    </div>
  );
}
