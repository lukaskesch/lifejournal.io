"use server";

import LiveTimeLogger from "@/components/LiveTimeLogger";
import { db } from "../../../db";
import { users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";

export default async function AppHome({}) {
  const usersResult = await db.select().from(users).execute();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, "lukas.kesch@gmail.com"))
    .limit(1)
    .execute()
    .then((result) => result[0]);
  console.log("Users from drizzle:", usersResult);
  console.log("User from drizzle:", user);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* {user.email} */}
      <LiveTimeLogger />
    </div>
  );
}
