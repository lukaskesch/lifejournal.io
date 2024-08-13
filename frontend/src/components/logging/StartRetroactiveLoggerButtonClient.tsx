"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function StartRetroactiveLoggerButtonClient() {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.push("app/logging/retroactive");
      }}
    >
      Log Retroactively
    </Button>
  );
}
