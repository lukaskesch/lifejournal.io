import { authOptions } from "@/lib/authOptions";
import db from "@/db";
import { users } from "@/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { promptAnswer, userPrompt } from "@/db/schema";
import AnswerPrompts from "@/components/diary/answer-prompts";

export default async function DiaryWrite() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

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

  const userPrompts = await db
    .select()
    .from(userPrompt)
    .where(eq(userPrompt.userId, user.id))
    .execute();

  const promptAnswers = await db
    .select()
    .from(promptAnswer)
    .where(
      inArray(
        promptAnswer.promptId,
        userPrompts.map((prompt) => prompt.id)
      )
    )
    .orderBy(desc(promptAnswer.createdAt))
    .execute();
  
  const logPromptAnswer = async (promptId: string, answer: string) => {
    "use server";
    if (!db) {
      return;
    }
    await db.insert(promptAnswer).values({
      id: crypto.randomUUID(),
      promptId,
      answer,
    });
  }
  
  
  return <AnswerPrompts prompts={userPrompts} logPromptAnswer={logPromptAnswer} />;
}
