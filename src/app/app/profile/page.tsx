import SignOutButton from "@/components/ui/SignOutButton";
import Avatar from "@/components/ui/Avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { users, promptAnswer, userTimeLog, userPrompt } from "@/db/schema";
import db from "@/db";
import { eq, sql } from "drizzle-orm";

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Loading...</div>;
  }

  if (!db || !session.user.email) {
    return <div>Error loading user data</div>;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1)
    .then((res) => res[0]);

  // Get counts
  const promptCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(promptAnswer)
    .innerJoin(userPrompt, eq(promptAnswer.promptId, userPrompt.id))
    .where(eq(userPrompt.userId, user.id))
    .then((res) => res[0]?.count ?? 0);

  const timeLogCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(userTimeLog)
    .where(eq(userTimeLog.userId, user.id))
    .then((res) => res[0]?.count ?? 0);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar src={session.user.image} name={session.user.name} size={64} />
          <div>
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {new Date(user.createdAt!).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="text-sm text-gray-600">Member Since</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {timeLogCount}
            </div>
            <div className="text-sm text-gray-600">Activities Logged</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-primary">{promptCount}</div>
            <div className="text-sm text-gray-600">Prompts Answered</div>
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <SignOutButton />
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Developed with ❤️ and passion by{" "}
            <a href="https://kesch.dev" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              kesch.dev
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


