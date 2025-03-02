"use client";

import { Button } from "../ui/button";
import * as React from "react";
import { toMySQLDatetime } from "../../db/db-utils";
import SelectTagsClient from "./SelectTagsClient";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { UserTagSelect, UserSelect, UserTimeLogSelect } from "@/types/database-types";
import { v4 as uuidv4 } from "uuid";

export default function LiveTimeLoggerClient({
  user,
  userTags,
  loggedTimeCallback,
  addTagsToFocusLogCallback,
}: {
  user: UserSelect;
  userTags: UserTagSelect[];
  loggedTimeCallback: (focusLog: UserTimeLogSelect) => Promise<string>;
  addTagsToFocusLogCallback: (
    focusLogId: string,
    tagIds: string[]
  ) => Promise<void>;
}) {
  const [startTime, setStartTime] = React.useState<Date>();
  const [endTime, setEndTime] = React.useState<Date>();
  const [selectedTagsIds, setSelectedTagsIds] = React.useState<string[]>([]);
  const [loggedFocusId, setLoggedFocusId] = React.useState<string>();
  const [description, setDescription] = React.useState("");

  const router = useRouter();

  React.useEffect(() => {
    const storedStartTime = localStorage.getItem("startTime");
    console.log("Stored start time:", storedStartTime);
    if (storedStartTime) {
      setStartTime(new Date(storedStartTime));
    } else {
      setStartTime(new Date());
    }
  }, []);

  React.useEffect(() => {
    if (startTime) {
      localStorage.setItem("startTime", startTime.toISOString());
    }
  }, [startTime]);

  React.useEffect(() => {
    if (endTime) {
      localStorage.removeItem("startTime");
    }
  }, [endTime]);

  function stopInterval() {
    if (!startTime) {
      return;
    }
    setEndTime(new Date());
    const endTime = new Date();
    loggedTimeCallback({
      id: uuidv4(),
      userId: user.id,
      startTime: toMySQLDatetime(startTime || new Date()),
      endTime: toMySQLDatetime(endTime || new Date()),
      durationMinutes: Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000 / 60
      ),
      description: description,
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

  async function handleSaveTagsClick() {
    console.log("Saving tags");
    if (!loggedFocusId) {
      console.error("No logged focus id");
      return;
    }
    await addTagsToFocusLogCallback(loggedFocusId, selectedTagsIds);

    const callbackUrl = decodeURIComponent(
      window.location.search.split("callbackUrl=")[1]
    );
    if (callbackUrl) {
      router.push(callbackUrl);
    }
  }

  function renderContent() {
    if (startTime && endTime) {
      return (
        <div className="flex flex-col justify-center min-w-96 max-w-screen-md">
          <div className="self-center mb-10">
            <h1>
              You logged{" "}
              {Math.floor(
                (endTime.getTime() - startTime.getTime()) / 1000 / 60
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
        </div>
      );
    }

    if (startTime) {
      return (
        <>
          <div className="m-4">
            <DigitalStopwatch startTime={startTime} />
          </div>
          <div className="">
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="self-center m-4">
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
  const outputMinutes = minutes % 60 < 10 ? `0${minutes % 60}` : minutes % 60;
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
