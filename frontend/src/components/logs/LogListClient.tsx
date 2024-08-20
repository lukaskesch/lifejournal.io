"use client";

import React from "react";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";
import { TimeLoggedChart } from "./TimeLoggedChart";

export default function LogListClient({
  logsWithTags,
}: {
  logsWithTags: FocusLogWithTags[];
}) {
  const [overviewText, setOverviewText] = React.useState("");

  const hours = React.useMemo(() => {
    return Math.floor(
      logsWithTags.reduce((acc, log) => {
        return acc + log.duration_minutes;
      }, 0) / 60,
    );
  }, [logsWithTags]);

  const numberOfLogs = React.useMemo(() => {
    return logsWithTags.length;
  }, [logsWithTags]);

  const uniqueTagsCount = React.useMemo(() => {
    const uniqueTags = new Set<string>();
    logsWithTags.forEach((log) => {
      log.tags.forEach((tag) => {
        uniqueTags.add(tag.name);
      });
    });
    return uniqueTags.size;
  }, [logsWithTags]);

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
    <div className="flex flex-col min-h-screen m-2">
      <div className="mr-4 my-4">
        <TimeLoggedChart logsWithTags={logsWithTags} />
      </div>
      <div className="flex flex-row justify-between m-2">
        <div className="font-bold text-2xl">{numberOfLogs} logs</div>
        <div className="font-bold text-2xl">{hours} hours</div>
        <div className="font-bold text-2xl">{uniqueTagsCount} tags</div>
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

  function formatDuration(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    if (hours === 0) {
      return `${minutes} minutes`;
    }
    return `${hours} hours ${minutes} minutes`;
  }

  const timespanString = `${formatOutputTime(log.start_time)} - ${formatOutputTime(log.end_time)}`;

  return (
    <div className="border p-2 my-2 rounded-lg">
      <div className="font-bold">{formatDuration(log.duration_minutes)}</div>
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
