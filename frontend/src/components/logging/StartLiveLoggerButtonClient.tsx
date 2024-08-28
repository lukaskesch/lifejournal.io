"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

export default function StartLiveLoggerButtonClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("Session:", session);
  return (
    <Button
      onClick={() => {
        router.push("app/logging/live");
      }}
    >
      Start Live Logger
    </Button>
  );
}
