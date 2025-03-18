'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { eq, and } from "drizzle-orm";
import { users, userPrompt } from "@/types/schema";
import db from "@/db";
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from "next/cache";

async function getUserFromSession() {
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

  return user;
}

export async function addPrompt(prompt: string) {
  if (!prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const user = await getUserFromSession();

  if (!db) {
    throw new Error("Database not initialized");
  }

  await db.insert(userPrompt).values({
    id: uuidv4(),
    userId: user.id,
    prompt: prompt.trim(),
  });

  revalidatePath('/app/diary/questions');
}

async function verifyPromptOwnership(promptId: string, userId: string) {
  if (!db) {
    throw new Error("Database not initialized");
  }

  const prompt = await db
    .select()
    .from(userPrompt)
    .where(and(eq(userPrompt.id, promptId), eq(userPrompt.userId, userId)))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!prompt) {
    throw new Error("Prompt not found or unauthorized");
  }

  return prompt;
}

export async function deletePrompt(promptId: string) {
  const user = await getUserFromSession();

  if (!db) {
    throw new Error("Database not initialized");
  }

  await verifyPromptOwnership(promptId, user.id);

  await db
    .delete(userPrompt)
    .where(
      and(
        eq(userPrompt.id, promptId),
        eq(userPrompt.userId, user.id)
      )
    )
    .execute();

  revalidatePath('/app/diary/questions');
}

export async function updatePrompt(promptId: string, prompt: string) {
  if (!prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const user = await getUserFromSession();

  if (!db) {
    throw new Error("Database not initialized");
  }

  await verifyPromptOwnership(promptId, user.id);

  await db
    .update(userPrompt)
    .set({ prompt: prompt.trim() })
    .where(and(eq(userPrompt.id, promptId), eq(userPrompt.userId, user.id)))
    .execute();

  revalidatePath('/app/diary/questions');
}
