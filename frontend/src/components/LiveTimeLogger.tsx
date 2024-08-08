"use client";

import { Button } from "./ui/button";
import * as React from "react";

export default function LiveTimeLogger() {
  const [startTime, setStartTime] = React.useState<Date>();
  const [durationInSeconds, setDurationInSeconds] = React.useState<number>(0);
  const [endTime, setEndTime] = React.useState<Date>();

  const interval = React.useRef<NodeJS.Timeout>();

  const seconds = durationInSeconds % 60;
  const minutes = Math.floor(durationInSeconds / 60);
  const hours = Math.floor(minutes / 60);

  function startInterval() {
    interval.current = setInterval(() => {
      setDurationInSeconds((prev) => (prev || 0) + 1);
    }, 1000);
  }

  function stopInterval() {
    if (interval.current) {
      console.log("Clearing interval");
      clearInterval(interval.current);
    }
  }

  function handleStartClick() {
    setStartTime(new Date());
    startInterval();
  }

  function handleStopClick() {
    setEndTime(new Date());
    stopInterval();
  }

  function renderContent() {
    if (endTime) {
      return (
        <>
          <h1>Time logged</h1>
          <p>
            Start time: {startTime?.getTime()} - End time: {endTime?.getTime()}{" "}
            - Duration:{durationInSeconds} seconds
          </p>
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
