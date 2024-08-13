"use server";

import StartLiveLoggerButtonClient from "@/components/logging/StartLiveLoggerButtonClient";

export default async function AppHome({}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* {user.email} */}
      <StartLiveLoggerButtonClient />
    </div>
  );
}
