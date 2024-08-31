"use server";

import { headers } from "next/headers";

export default async function AppHome({}) {
  headers();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24"></div>
  );
}
