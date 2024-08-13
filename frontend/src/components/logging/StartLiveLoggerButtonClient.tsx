"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function StartLiveLoggerButtonClient() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("app/live-logging");
      }}
    >
      Start Live Logger
    </Button>
  );
}
