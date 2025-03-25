import { authOptions } from "@/lib/authOptions";
import db from "@/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { promptAnswer, userPrompt, users } from "@/db/schema";
import { notFound } from "next/navigation";
import PromptAnswerClient from "./PromptAnswerClient";
import "@/app/globals.css";

export default async function PromptAnswerPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId || !db) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!user) {
    return null;
  }

  const answer = await db
    .select()
    .from(promptAnswer)
    .where(eq(promptAnswer.id, params.id))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!answer) {
    notFound();
  }

  const prompt = await db
    .select()
    .from(userPrompt)
    .where(eq(userPrompt.id, answer.promptId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!prompt) {
    notFound();
  }

  return <PromptAnswerClient answer={answer} prompt={prompt} />;
}
