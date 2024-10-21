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

export default function RetroactiveLoggerClient({
  userTags,
  loggedFocusCallback,
  user,
}: {
  user: User;
  userTags: UserTags[];
  loggedFocusCallback: (focusLog: RetroactiveFocusLog) => Promise<string>;
}) {
  const [startDateTimeString, setStartDateTimeString] = React.useState("");
  const [finishDateTimeString, setFinishDateTimeString] = React.useState("");
  const [selectedTagsIds, setSelectedTagsIds] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");

  const router = useRouter();

  React.useEffect(() => {
    const now = new Date();

    const formattedFinsihDateTime = formatDateTimeLocalToString(now);
    setFinishDateTimeString(formattedFinsihDateTime);

    now.setHours(now.getHours() - 1);
    const formattedStartDateTime = formatDateTimeLocalToString(now);
    setStartDateTimeString(formattedStartDateTime);
  }, []);

  React.useEffect(() => {
    if (!startDateTimeString) return;
    const startDateTime = formatStringToDateTimeLocal(startDateTimeString);
    startDateTime.setHours(startDateTime.getHours() + 1);
    setFinishDateTimeString(formatDateTimeLocalToString(startDateTime));
  }, [startDateTimeString]);

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

  const handleStartDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDateTimeString(event.target.value);
  };

  const handleFinishDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFinishDateTimeString(event.target.value);
  };

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

  return (
    <div className="flex flex-col min-w-96 max-w-screen-md">
      <div className="self-center p-4">
        <Input
          type="datetime-local"
          value={startDateTimeString}
          onChange={handleStartDateTimeChange}
        />
      </div>
      <div className="self-center p-4">
        <Input
          type="datetime-local"
          value={finishDateTimeString}
          onChange={handleFinishDateTimeChange}
        />
      </div>
      <div className="self-center p-4">
        <SelectTagsClient
          userTags={userTags}
          selectedTagsIds={selectedTagsIds}
          setSelectedTagsIds={setSelectedTagsIds}
        />
      </div>
      <div className="self-stretch p-4">
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="resize-none"
        />
      </div>
      <div className="self-center p-4">
        <Button onClick={handleLogTime}>Log time</Button>
      </div>
    </div>
  );
}
