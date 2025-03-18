'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { eq } from "drizzle-orm/expressions";
import { users, userPrompt } from "@/types/schema";
import db from "@/db";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";

export async function addQuestion(prompt: string) {
  if (!prompt.trim()) {
    throw new Error("Prompt is required");
  }

  if (!db) {
    throw new Error("Database not initialized");
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!user) {
    throw new Error("User not found");
  }

  await db.insert(userPrompt).values({
    id: uuidv4(),
    userId: user.id,
    prompt: prompt.trim(),
  });

  revalidatePath('/app/diary/questions');
}
