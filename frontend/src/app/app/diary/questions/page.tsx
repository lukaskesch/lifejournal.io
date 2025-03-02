import { authOptions } from "@/lib/authOptions";
import { eq } from "drizzle-orm/expressions";
import { getServerSession } from "next-auth";
import { userPrompt, users } from "@/types/schema";
import db from "@/db";

export default async function DiaryQuestions() {

  if(!db) {
    return <div>Database not found</div>;
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute()
    .then((result) => result[0]);
  
  const userQuestions = await db
    .select()
    .from(userPrompt)
    .where(eq(userPrompt.userId, user.id))
    .execute()

  return (
    <div className="flex flex-col gap-2">
      {userQuestions.map((question) => (
        <div key={question.id} className="flex flex-col gap-2">
          <h2>{question.prompt}</h2>
        </div>
      ))}
    </div>
  );
}
