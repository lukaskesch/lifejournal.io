import Toolbar from "@/components/layout/toolbar";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/authOptions";
import db from "@/db";
import { users } from "@/types/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { promptAnswer, userPrompt } from "@/db/schema";

export default async function DiaryPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

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
    .where(inArray(promptAnswer.promptId, userPrompts.map((prompt) => prompt.id)))
    .orderBy(desc(promptAnswer.createdAt))
    .execute();
  
  console.log(promptAnswers);
  console.log(userPrompts);
  

  return (
    <div>
      <Toolbar>
        <div className="font-bold text-lg">Diary</div>
        <div className="flex flex-row items-center gap-4">
          <Link href="/app/diary/questions">Manage Questions</Link>
          {/* <Link href="/app/diary/entries">Entries</Link> */}
          <Link href="/app/diary/write">
            <Button>Write</Button>
          </Link>
        </div>
      </Toolbar>
    </div>
  );
}
