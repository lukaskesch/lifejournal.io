import Toolbar from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/authOptions";
import db from "@/db";
import { desc, eq, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { promptAnswer, userPrompt, users } from "@/db/schema";

export default async function DiaryPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || !db) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
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

  const promptAnswersWithPrompts = promptAnswers.map((answer) => ({
    ...answer,
    prompt: userPrompts.find((prompt) => prompt.id === answer.promptId),
  }));

  return (
    <div>
      <Toolbar>
        <div className="font-bold text-lg">Diary</div>
        <div className="flex flex-row items-center gap-4">
          <Link href="/app/diary/prompts">Manage Prompts</Link>
          {/* <Link href="/app/diary/entries">Entries</Link> */}
          <Link href="/app/diary/write">
            <Button>Write</Button>
          </Link>
        </div>
      </Toolbar>
      <div className="flex flex-col gap-8 max-w-xl mx-auto px-2 min-h-screen mt-10">
        {promptAnswersWithPrompts.map((answer) => (
          <div key={answer.id}>
            <div className="flex flex-row gap-2 items-center justify-between">
              <div className="font-bold">{answer.prompt?.prompt}</div>
              <div className="text-sm text-gray-500">
                {new Date(answer.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>{answer.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
