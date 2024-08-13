"use client";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";

export default function RetroactiveLoggerClient() {
  const [startDateTime, setStartDateTime] = useState("");
  const [startPlaceholder, setStartPlaceholder] = useState("");

  const [finishDateTime, setFinishDateTime] = useState("");
  const [finishPlaceholder, setFinishPlaceholder] = useState("");

  useEffect(() => {
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
    </div>
  );
}
