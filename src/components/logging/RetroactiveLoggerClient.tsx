"use client";
import React from "react";
import { Input } from "../ui/input";
import SelectTagsClient from "./SelectTagsClient";
import { Button } from "../ui/button";
import { RetroactiveFocusLog } from "@/types/RetroactiveFocusLog";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSelect, UserTagSelect } from "@/types/database-types";

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

const durations = [
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
  user: UserSelect;
  userTags: UserTagSelect[];
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

  const durationInMinutes = React.useMemo(() => {
    return Math.floor(
      (new Date(finishDateTimeString).getTime() -
        new Date(startDateTimeString).getTime()) /
        60000
    );
  }, [finishDateTimeString, startDateTimeString]);

  const router = useRouter();

  const handleLogTime = async () => {
    const convertedStartDateTime = new Date(startDateTimeString);
    const convertedFinishDateTime = new Date(finishDateTimeString);
    const duration = Math.floor(
      (convertedFinishDateTime.getTime() - convertedStartDateTime.getTime()) /
        60000
    );

    const focusLog: RetroactiveFocusLog = {
      startTime: startDateTimeString,
      endTime: finishDateTimeString,
      userId: user.id,
      durationMinutes: duration,
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
            onChange={(event) => {
              setStartDateTimeString(event.target.value);
              const newDate = formatStringToDateTimeLocal(event.target.value);
              newDate.setTime(newDate.getTime() + 1 * 60 * 60 * 1000);
              setFinishDateTimeString(formatDateTimeLocalToString(newDate));
            }}
          />
        </div>
        <div className="flex flex-row pt-6">
          {durations.map((offset) => (
            <div
              key={offset.name}
              className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => {
                const newDate = new Date(startDateTimeString);
                newDate.setTime(newDate.getTime() - offset.offset);
                setStartDateTimeString(formatDateTimeLocalToString(newDate));
                newDate.setTime(newDate.getTime() + 1 * 60 * 60 * 1000);
                setFinishDateTimeString(formatDateTimeLocalToString(newDate));
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
    return (
      <div className="flex flex-col min-w-96 min-h-72 max-w-screen-md items-center">
        <Tabs
          defaultValue="duration"
          className="w-full flex flex-col items-center">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="duration">Duration</TabsTrigger>
            <TabsTrigger value="datetime">Datetime</TabsTrigger>
          </TabsList>
          <TabsContent value="duration">
            <div className="pt-6">
              <Input
                type="number"
                value={durationInMinutes}
                onChange={(event) => {
                  const newDuration = parseInt(event.target.value);
                  const newFinishTime = new Date(
                    new Date(startDateTimeString).getTime() +
                      newDuration * 60000
                  );
                  setFinishDateTimeString(
                    formatDateTimeLocalToString(newFinishTime)
                  );
                }}
              />
            </div>
            <div className="flex flex-row self-center pt-6">
              {durations.map((duration) => (
                <div
                  key={duration.name}
                  className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    const newFinishTime = new Date(
                      new Date(startDateTimeString).getTime() + duration.offset
                    );
                    setFinishDateTimeString(
                      formatDateTimeLocalToString(newFinishTime)
                    );
                  }}>
                  {duration.name}
                </div>
              ))}
            </div>
            <div className="pt-6 self-center">
              End: {new Date(finishDateTimeString).toLocaleString("de-DE")}
            </div>
          </TabsContent>
          <TabsContent value="datetime">
            <div className="pt-6">
              <Input
                type="datetime-local"
                value={finishDateTimeString}
                onChange={(event) =>
                  setFinishDateTimeString(event.target.value)
                }
              />
            </div>
            <div className="flex flex-row  self-center pt-6">
              <div
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-md"
                onClick={() => {
                  const newFinishTime = new Date();
                  setFinishDateTimeString(
                    formatDateTimeLocalToString(newFinishTime)
                  );
                }}>
                now
              </div>
            </div>
            <div className="pt-6">Duration: {durationInMinutes} min</div>
          </TabsContent>
        </Tabs>

        {/* <div>
          Start: {new Date(startDateTimeString).toLocaleString("de-DE")}
        </div> */}

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
