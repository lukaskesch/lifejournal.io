"use client";

import React from "react";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";
import { TimeLoggedChart } from "./TimeLoggedChart";

export default function LogListClient({
  logsWithTags,
}: {
  logsWithTags: FocusLogWithTags[];
}) {
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
      return `${minutes}min`;
    }
    return `${hours}h ${minutes}min`;
  }

  return (
    <div className="p-2 m-2 rounded-lg bg-slate-100">
      <div className="font-bold">
        {formatOutputDate(log.start_time)}
        {/* {" – "} */}
        <span className="font-medium">{" | "}</span>
        {formatDuration(log.duration_minutes)}
      </div>
      {/* <div>{log.id}</div> */}
      <div>{log.description}</div>
      <div className="mt-1">
        {log.tags.map((tag) => (
          <span key={tag.id} className="bg-slate-200 rounded-lg p-1 px-2 mr-2">
            {/* {"#"} */}
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
