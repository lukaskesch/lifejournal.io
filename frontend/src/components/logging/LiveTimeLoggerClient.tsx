"use client";

import { FocusLog } from "@/types/FocusLog";
import { Button } from "../ui/button";
import * as React from "react";
import { toMySQLDatetime } from "../../../db/db-utils";
import { User, UserTags } from "../../../drizzle/schema";
import SelectTagsClient from "./SelectTagsClient";

export default function LiveTimeLoggerClient({
  user,
  userTags,
  loggedTimeCallback,
  addTagsToFocusLogCallback,
}: {
  user: User;
  userTags: UserTags[];
  loggedTimeCallback: (FocusLog: FocusLog) => Promise<string>;
  addTagsToFocusLogCallback: (focusLogId: string, tagIds: string[]) => void;
}) {
  const [startTime, setStartTime] = React.useState<Date>(new Date());
  const [endTime, setEndTime] = React.useState<Date>();
  const [selectedTagsIds, setSelectedTagsIds] = React.useState<string[]>([]);
  const [loggedFocusId, setLoggedFocusId] = React.useState<string>();

  function stopInterval() {
    if (!startTime) {
      return;
    }
    setEndTime(new Date());
    const endTime = new Date();
    loggedTimeCallback({
      user_id: user.id,
      start_time: toMySQLDatetime(startTime || new Date()),
      end_time: toMySQLDatetime(endTime || new Date()),
      duration_minutes: Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000 / 60,
      ),
      description: "",
    })
      .then(setLoggedFocusId)
      .catch(console.error);
  }

  function handleStartClick() {
    setStartTime(new Date());
  }

  function handleStopClick() {
    setEndTime(new Date());
    stopInterval();
  }

  function handleSaveTagsClick() {
    console.log("Saving tags");
    if (!loggedFocusId) {
      console.error("No logged focus id");
      return;
    }
    addTagsToFocusLogCallback(loggedFocusId, selectedTagsIds);
  }

  function renderContent() {
    if (startTime && endTime) {
      return (
        <>
          <div className="self-center mb-10">
            <h1>
              You logged{" "}
              {Math.floor(
                (endTime.getTime() - startTime.getTime()) / 1000 / 60,
              )}{" "}
              minutes 🔥
            </h1>
          </div>
          <SelectTagsClient
            userTags={userTags}
            selectedTagsIds={selectedTagsIds}
            setSelectedTagsIds={setSelectedTagsIds}
          />
          <div className="self-center mt-10">
            <Button onClick={handleSaveTagsClick}>Add tags</Button>
          </div>
        </>
      );
    }

    if (startTime) {
      return (
        <>
          <div className="m-4">
            <DigitalStopwatch startTime={startTime} />
          </div>
          <div className="self-center">
            <Button onClick={handleStopClick}>Stop logging</Button>
          </div>
        </>
      );
    }

    return (
      <>
        <Button onClick={handleStartClick}>Start logging</Button>
      </>
    );
  }
  return <div className="flex flex-col align-center">{renderContent()}</div>;
}

function DigitalStopwatch({ startTime }: { startTime: Date }) {
  const [durationInSeconds, setDurationInSeconds] = React.useState<number>(0);
  const seconds = durationInSeconds % 60;
  const minutes = Math.floor(durationInSeconds / 60);
  const hours = Math.floor(minutes / 60);

  const outputSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const outputMinutes = minutes < 10 ? `0${minutes % 60}` : minutes;
  const outputHours = hours < 10 ? `0${hours}` : hours;

  const interval = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    interval.current = setInterval(() => {
      const duration = new Date().getTime() - startTime.getTime();
      setDurationInSeconds(Math.floor(duration / 1000));
    }, 100);
    return () => {
      clearInterval(interval.current);
    };
  }, [startTime]);

  return (
    <div className="flex flex-row justify-center align-middle text-7xl font-mono">
      <div>{outputHours}</div>:<div>{outputMinutes}</div>:
      <div>{outputSeconds}</div>
    </div>
  );
}
