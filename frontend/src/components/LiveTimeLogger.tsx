"use client";

import { FocusLog } from "@/types/FocusLog";
import { Button } from "./ui/button";
import * as React from "react";
import { toMySQLDatetime } from "../../db/db-utils";
import { User, UserTags } from "../../drizzle/schema";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function LiveTimeLogger({
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
  const [startTime, setStartTime] = React.useState<Date>();
  const [durationInSeconds, setDurationInSeconds] = React.useState<number>(0);
  const [endTime, setEndTime] = React.useState<Date>();
  const [selectedTagsIds, setSelectedTagsIds] = React.useState<string[]>([]);
  const [loggedFocusId, setLoggedFocusId] = React.useState<string>();

  const interval = React.useRef<NodeJS.Timeout>();

  const durationInMinutes = Math.floor(durationInSeconds / 60);

  function startInterval() {
    interval.current = setInterval(() => {
      setDurationInSeconds((prev) => (prev || 0) + 1);
    }, 1000);
  }

  console.log(loggedFocusId);

  function stopInterval() {
    if (interval.current) {
      clearInterval(interval.current);
    }
    loggedTimeCallback({
      user_id: user.id,
      start_time: toMySQLDatetime(startTime || new Date()),
      end_time: toMySQLDatetime(endTime || new Date()),
      duration_minutes: durationInMinutes,
      description: "",
    })
      .then(setLoggedFocusId)
      .catch(console.error);
  }

  function handleStartClick() {
    setStartTime(new Date());
    startInterval();
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
    if (endTime) {
      return (
        <>
          <div className="self-center mb-10">
            <h1>You logged {durationInMinutes} minutes 🔥</h1>
          </div>
          <AddTagsToLog
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
            <DigitalStopwatch durationInSeconds={durationInSeconds} />
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

function AddTagsToLog({
  userTags,
  selectedTagsIds,
  setSelectedTagsIds,
}: {
  userTags: UserTags[];
  selectedTagsIds: string[];
  setSelectedTagsIds: (tags: string[]) => void;
}) {
  return (
    <div>
      <ToggleGroup
        type="multiple"
        value={selectedTagsIds}
        onValueChange={setSelectedTagsIds}
      >
        {userTags.map((tag) => (
          <ToggleGroupItem key={tag.id} value={tag.id}>
            {"#" + tag.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul></ul>
    </div>
  );
}

function DigitalStopwatch({
  durationInSeconds,
}: {
  durationInSeconds: number;
}) {
  const seconds = durationInSeconds % 60;
  const minutes = Math.floor(durationInSeconds / 60);
  const hours = Math.floor(minutes / 60);

  const outputSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const outputMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const outputHours = hours < 10 ? `0${hours}` : hours;

  return (
    <div className="flex flex-row justify-center align-middle text-7xl font-mono">
      <div>{outputHours}</div>:<div>{outputMinutes}</div>:
      <div>{outputSeconds}</div>
    </div>
  );
}
