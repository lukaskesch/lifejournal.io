"use client";
import React from "react";
import { Input } from "../ui/input";
import SelectTagsClient from "./SelectTagsClient";
import { User, UserTags } from "../../../drizzle/schema";
import { Button } from "../ui/button";
import { RetroactiveFocusLog } from "@/types/RetroactiveFocusLog";
import { toMySQLDatetime } from "../../../db/db-utils";

export default function RetroactiveLoggerClient({
  userTags,
  loggedFocusCallback,
  user,
}: {
  user: User;
  userTags: UserTags[];
  loggedFocusCallback: (focusLog: RetroactiveFocusLog) => Promise<string>;
}) {
  const [startDateTime, setStartDateTime] = React.useState("");
  const [startPlaceholder, setStartPlaceholder] = React.useState("");
  const [finishDateTime, setFinishDateTime] = React.useState("");
  const [finishPlaceholder, setFinishPlaceholder] = React.useState("");
  const [selectedTagsIds, setSelectedTagsIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const now = new Date();

    const formattedFinsihDateTime = formatDateTimeLocal(now);
    setFinishPlaceholder(formattedFinsihDateTime);
    setFinishDateTime(formattedFinsihDateTime);

    now.setHours(now.getHours() - 1);
    const formattedStartDateTime = formatDateTimeLocal(now);
    setStartPlaceholder(formattedStartDateTime);
    setStartDateTime(formattedStartDateTime);
  }, []);

  const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleStartDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setStartDateTime(event.target.value);
    console.log("Selected date and time:", event.target.value);
  };

  const handleFinishDateTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFinishDateTime(event.target.value);
    console.log("Selected date and time:", event.target.value);
  };

  const handleLogTime = async () => {
    const convertedStartDateTime = new Date(startDateTime);
    const convertedFinishDateTime = new Date(finishDateTime);
    const duration = Math.floor(
      (convertedFinishDateTime.getTime() - convertedStartDateTime.getTime()) /
        60000,
    );

    const focusLog: RetroactiveFocusLog = {
      start_time: startDateTime,
      end_time: finishDateTime,
      user_id: user.id,
      duration_minutes: duration,
      description: "",
      tagIds: selectedTagsIds,
    };

    console.log("Logging focus:", focusLog);

    await loggedFocusCallback(focusLog);
  };

  return (
    <div>
      <Input
        type="datetime-local"
        placeholder={startPlaceholder}
        value={startDateTime}
        onChange={handleStartDateTimeChange}
      />
      <Input
        type="datetime-local"
        placeholder={finishPlaceholder}
        value={finishDateTime}
        onChange={handleFinishDateTimeChange}
      />
      <SelectTagsClient
        userTags={userTags}
        selectedTagsIds={selectedTagsIds}
        setSelectedTagsIds={setSelectedTagsIds}
      />
      <Button onClick={handleLogTime}>Log time</Button>
    </div>
  );
}
