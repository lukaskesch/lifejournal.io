"use server";

import StartLiveLoggerButtonClient from "@/components/logging/StartLiveLoggerButtonClient";
import StartRetroactiveLoggerButtonClient from "@/components/logging/StartRetroactiveLoggerButtonClient";

export default async function AppHome({}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* {user.email} */}
      <div className="p-4">
        <StartLiveLoggerButtonClient />
      </div>
      <div className="p-4">
        <StartRetroactiveLoggerButtonClient />
      </div>
    </div>
  );
}
