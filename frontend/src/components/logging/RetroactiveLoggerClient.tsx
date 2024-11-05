"use client";
import React from "react";
import { Input } from "../ui/input";
import SelectTagsClient from "./SelectTagsClient";
import { User, UserTags } from "../../../drizzle/schema";
import { Button } from "../ui/button";
import { RetroactiveFocusLog } from "@/types/RetroactiveFocusLog";
import { toMySQLDatetime } from "../../db/db-utils";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

const formatDateTimeLocalToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatStringToDateTimeLocal = (dateString: string): Date => {
  const newDate = new Date();
  const year = parseInt(dateString.slice(0, 4));
  newDate.setFullYear(year);
  const month = parseInt(dateString.slice(5, 7)) - 1;
  newDate.setMonth(month);
  const day = parseInt(dateString.slice(8, 10));
  newDate.setDate(day);
  const hours = parseInt(dateString.slice(11, 13));
  newDate.setHours(hours);
  const minutes = parseInt(dateString.slice(14, 16));
  newDate.setMinutes(minutes);
  return newDate;
};

const offsets = [
  { name: "15 min", offset: 15 * 60 * 1000 },
  { name: "30 min", offset: 30 * 60 * 1000 },
  { name: "45 min", offset: 45 * 60 * 1000 },
  { name: "1 h", offset: 60 * 60 * 1000 },
];

type DetermineFinishDateTime = "duration" | "datetime";

export default function RetroactiveLoggerClient({
  userTags,
  loggedFocusCallback,
  user,
}: {
  user: User;
  userTags: UserTags[];
  loggedFocusCallback: (focusLog: RetroactiveFocusLog) => Promise<string>;
}) {
  const [startDateTimeString, setStartDateTimeString] = React.useState(
    formatDateTimeLocalToString(new Date())
  );
  const [isStartDateTimeChosen, setIsStartDateTimeChosen] =
    React.useState(false);
  const [finishDateTimeString, setFinishDateTimeString] = React.useState(
    formatDateTimeLocalToString(new Date())
  );
  const [isFinishDateTimeChosen, setIsFinishDateTimeChosen] =
    React.useState(false);
  const [selectedTagsIds, setSelectedTagsIds] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");

  const router = useRouter();

 
  const handleLogTime = async () => {
    const convertedStartDateTime = new Date(startDateTimeString);
    const convertedFinishDateTime = new Date(finishDateTimeString);
    const duration = Math.floor(
      (convertedFinishDateTime.getTime() - convertedStartDateTime.getTime()) /
        60000
    );

    const focusLog: RetroactiveFocusLog = {
      start_time: startDateTimeString,
      end_time: finishDateTimeString,
      user_id: user.id,
      duration_minutes: duration,
      description: description,
      tagIds: selectedTagsIds,
    };

    console.log("Logging focus:", focusLog);

    await loggedFocusCallback(focusLog);

    const callbackUrl = decodeURIComponent(
      window.location.search.split("callbackUrl=")[1]
    );
    if (callbackUrl) {
      router.push(callbackUrl);
    }
  };

  if (!isStartDateTimeChosen) {
    return (
      <div className="flex flex-col min-w-96 max-w-screen-md items-center">
        <div>
          <Input
            type="datetime-local"
            value={startDateTimeString}
            onChange={event=>setStartDateTimeString(event.target.value)}
          />
        </div>
        <div className="flex flex-row pt-6">
          {offsets.map((offset) => (
            <div
              key={offset.name}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => {
                const newDate = new Date(startDateTimeString);
                newDate.setTime(newDate.getTime() - offset.offset);
                setStartDateTimeString(formatDateTimeLocalToString(newDate));
              }}>
              -{offset.name}
            </div>
          ))}
        </div>
        <div className="pt-6">
          <Button onClick={() => setIsStartDateTimeChosen(true)}>
            Set start time
          </Button>
        </div>
      </div>
    );
  }

  if (!isFinishDateTimeChosen) {
    // TODO: Add tab for selecting duration
    return (
      <div className="flex flex-col min-w-96 max-w-screen-md items-center">
        {/* <div>
          Start: {new Date(startDateTimeString).toLocaleString("de-DE")}
        </div> */}
        <div className="">
          <Input
            type="datetime-local"
            value={finishDateTimeString}
            onChange={(event) => setFinishDateTimeString(event.target.value)}
          />
        </div>
        <div className="pt-6">
          <div>
            Duration:{" "}
            {Math.floor(
              (new Date(finishDateTimeString).getTime() -
                new Date(startDateTimeString).getTime()) /
                60000
            )}{" "}
            minutes
          </div>
        </div>
        <div className="pt-6">
          <Button onClick={() => setIsFinishDateTimeChosen(true)}>
            Set end time
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-w-96 max-w-screen-md items-center">
      <div className="pt-6">
        <SelectTagsClient
          userTags={userTags}
          selectedTagsIds={selectedTagsIds}
          setSelectedTagsIds={setSelectedTagsIds}
        />
      </div>
      <div className="pt-6 self-stretch">
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="resize-none"
        />
      </div>
      <div className="pt-6">
        <Button onClick={handleLogTime}>Log time</Button>
      </div>
    </div>
  );
}
