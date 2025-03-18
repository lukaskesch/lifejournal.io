import { authOptions } from "@/lib/authOptions";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { userPrompt, users } from "@/types/schema";
import db from "@/db";
import AddQuestion from "./AddQuestion";
import { deleteQuestion, updateQuestion } from "./actions";
import EditQuestion from "./EditQuestion";

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
    .orderBy(desc(userPrompt.createdAt))
    .execute();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Journal Questions</h1>
      <AddQuestion />
      <div className="grid gap-4">
        {userQuestions.map((question) => (
          <div 
            key={question.id} 
            className="p-4 bg-white rounded-lg shadow border border-gray-200"
          >
            <EditQuestion 
              question={question} 
              onDelete={async () => {
                'use server';
                await deleteQuestion(question.id);
              }}
              onUpdate={async (prompt: string) => {
                'use server';
                await updateQuestion(question.id, prompt);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
