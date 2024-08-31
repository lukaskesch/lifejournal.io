"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const fallbackCallbackUrl = "/app/logs/new";

export default function Page({}) {
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = React.useState(fallbackCallbackUrl);

  React.useEffect(() => {
    let callbackUrl = decodeURIComponent(
      window.location.search.split("callbackUrl=")[1],
    );
    if (!callbackUrl) {
      callbackUrl = fallbackCallbackUrl;
    }
    setCallbackUrl(callbackUrl);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="p-4">
        <Button
          onClick={() => {
            router.push(`/app/logs/new/live?callbackUrl=${callbackUrl}`);
          }}
        >
          Start Live Logger
        </Button>
      </div>
      <div className="p-4">
        <Button
          onClick={() => {
            router.push(`/app/logs/new/retroactive?callbackUrl=${callbackUrl}`);
          }}
        >
          Log Retroactively
        </Button>
      </div>
    </div>
  );
}
