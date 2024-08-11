"use server";

import LiveTimeLogger from "@/components/LiveTimeLogger";
import { db } from "../../../db";
import { user_time_log, users } from "../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import { FocusLog } from "@/types/FocusLog";

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

  async function handleLoggedFocus(focusLog: FocusLog) {
    "use server";
    try {
      await db.insert(user_time_log).values({
        id: uuidv4(),
        ...focusLog,
      });
    } catch (error) {
      console.error("Error logging time:", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      {user.email}
      <LiveTimeLogger loggedTimeCallback={handleLoggedFocus} />
    </div>
  );
}
