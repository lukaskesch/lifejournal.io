"use client";

import React from "react";
import { FocusLogWithTags } from "@/types/FocusLogWithTags";
import { TimeLoggedChart } from "./TimeLoggedChart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "../ui/date-range-picker";
import { UserTagSelect } from "@/types/database-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Toolbar from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";

export default function LogListClient({
  logsWithTags,
}: {
  logsWithTags: FocusLogWithTags[];
}) {
  const [tags, setTags] = React.useState<UserTagSelect[]>([]);
  const [selectedTagIds, setSelectedTagIds] = React.useState<string[]>([]);
  const [filteredLogs, setFilteredLogs] =
    React.useState<FocusLogWithTags[]>(logsWithTags);
  const [startDateTime, setStartDateTime] = React.useState<Date | undefined>(
    new Date(new Date().setDate(-30))
  );
  const [finishDateTime, setFinishDateTime] = React.useState<Date | undefined>(
    new Date()
  );

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = pathname + searchParams.toString();

  React.useEffect(() => {
    const allTags = logsWithTags.map((log) => log.tags).flat();
    const uniqueTagsMapIdsObject = new Map(allTags.map((tag) => [tag.id, tag]));
    const uniqueTags = Array.from(uniqueTagsMapIdsObject.values());
    // console.log("Unique tags", uniqueTags);
    setTags(uniqueTags);
  }, [logsWithTags]);

  React.useEffect(() => {
    let logs = [...logsWithTags];

    // Filter by tags
    if (selectedTagIds.length !== 0) {
      logs = logs.filter((log) =>
        log.tags.some((tag) => selectedTagIds.includes(tag.id))
      );
    }

    // Filter by date
    const _startDateTime = new Date(
      startDateTime ?? new Date(new Date().setDate(-30))
    );
    const _finishDateTime = new Date(finishDateTime ?? new Date());
    logs = logs.filter((log) => {
      if (!log.startTime) return false;
      const logDateTime = new Date(log.startTime);
      return logDateTime >= _startDateTime && logDateTime <= _finishDateTime;
    });

    setFilteredLogs(logs);
  }, [selectedTagIds, startDateTime, finishDateTime, logsWithTags]);

  const totalMinutes = React.useMemo(() => {
    return Math.floor(
      filteredLogs.reduce((acc, log) => {
        return acc + log.durationMinutes;
      }, 0)
    );
  }, [filteredLogs]);

  const numberOfLogs = React.useMemo(() => {
    return filteredLogs.length;
  }, [filteredLogs]);

  const uniqueTagsCount = React.useMemo(() => {
    const allTags = filteredLogs.map((log) => log.tags).flat();
    const uniqueTagsMapIdsObject = new Set(allTags.map((tag) => tag.id));
    return uniqueTagsMapIdsObject.size;
  }, [filteredLogs]);

  logsWithTags.sort((a, b) => {
    if (!a.startTime || !b.startTime) {
      return 0;
    }
    if (a.startTime < b.startTime) {
      return 1;
    }
    if (a.startTime > b.startTime) {
      return -1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen m-2">
      <Toolbar>
      <div className="flex flex-row justify-between gap-3">
          <div className="">Activities: #{numberOfLogs}</div>
        <div className="">
          {Math.floor(totalMinutes / 60) > 0
            ? Math.floor(totalMinutes / 60) + " hours"
            : totalMinutes + " minutes"}
        </div>
        {/* <div className="">{uniqueTagsCount} tags</div> */}
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Link href="/app/activities/tags" className="hover:text-gray-300">
            Manage Tags
          </Link>
        <Link
          href={`/app/activities/new?callbackUrl=${encodeURIComponent(
            currentUrl
          )}`}
            className="cursor-pointer">
            <Button>Log Time</Button>
          </Link>
        </div>
      </Toolbar>
      <div className="flex flex-row justify-between gap-2 m-2">
        <TagFilter
          tags={tags}
          selectedTags={selectedTagIds}
          setSelectedTags={setSelectedTagIds}
        />
        <DatePickerWithRange
          startDateTime={startDateTime}
          setStartDateTime={setStartDateTime}
          finishDateTime={finishDateTime}
          setFinishDateTime={setFinishDateTime}
        />
      </div>
      <div className="mr-4 my-4">
        <TimeLoggedChart
          logsWithTags={filteredLogs}
          startDateTime={startDateTime ?? new Date(new Date().setDate(-30))}
          finishDateTime={finishDateTime ?? new Date()}
        />
      </div>
      {filteredLogs.map((log) => (
        <Log key={log.id} log={log} />
      ))}
    </div>
  );
}

function TagFilter({
  tags,
  selectedTags,
  setSelectedTags,
}: {
  tags: UserTagSelect[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleValueChange = (value: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(value)) {
        return prev.filter((tag) => tag !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const getSelectedTagNames = (selectedTagIds: string[]): string[] => {
    return tags
      .filter((tag) => selectedTagIds.includes(tag.id))
      .map((tag) => tag.name);
  };

  return (
    <Select onValueChange={handleValueChange} value={"Alle Tags"}>
      <SelectTrigger>
        <SelectValue>
          {selectedTags.length === 0
            ? "All tags"
            : getSelectedTagNames(selectedTags).join(", ")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {tags.map((tag) => (
            <SelectItem
              key={tag.id}
              value={tag.id}
              className={`flex items-center justify-between ${
                selectedTags.includes(tag.id) ? "bg-primary/10 font-medium" : ""
              }`}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
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
        {formatOutputDate(log.startTime)}
        {/* {" – "} */}
        <span className="font-medium">{" | "}</span>
        {formatDuration(log.durationMinutes)}
      </div>
      {/* <div>{log.id}</div> */}
      <div>{log.description}</div>
      <div className="my-1">
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
