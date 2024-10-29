"use server";

import Streaks from "@/components/streaks/streaks";
import { headers } from "next/headers";

export default async function AppHome({}) {
  headers();
  return (
    <div className="flex min-h-screen flex-col items-stretch justify-center p-24">
      <Streaks />
    </div>
  );
}
