import SignOutButton from "@/components/ui/SignOutButton";
import Avatar from "@/components/ui/Avatar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { users } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";

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

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar
            src={session.user.image}
            name={session.user.name}
            size={64}
          />
          <div>
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-gray-600">{session.user.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              Member since {new Date(user.createdAt!).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}


