import { authOptions } from "@/lib/authOptions";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { userPrompt, users } from "@/types/schema";
import db from "@/db";
import AddPrompt from "./AddPrompt";
import { deletePrompt, updatePrompt } from "./actions";
import EditPrompt from "./EditPrompt";

export default async function DiaryPrompts() {
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
  
  const userPrompts  = await db
    .select()
    .from(userPrompt)
    .where(eq(userPrompt.userId, user.id))
    .orderBy(desc(userPrompt.createdAt))
    .execute();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Journal Prompts</h1>
      <AddPrompt />
      <div className="grid gap-4">
        {userPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <EditPrompt
              prompt={prompt}
              onDelete={async () => {
                "use server";
                await deletePrompt(prompt.id);
              }}
              onUpdate={async (newPrompt: string) => {
                "use server";
                await updatePrompt(prompt.id, newPrompt);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
