"use server";

import db from "@/db";
import { userTags, users } from "@/types/schema";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import TagsClient from "@/components/tags/TagsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { UserTagSelect } from "@/types/database-types";

export default async function Tags() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  if (!db) {
    return <div>Database not found</div>;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  async function getUserTags(userId: string) {
    const userTagsResult = await db
      .select()
      .from(userTags)
      .where(eq(userTags.userId, userId))
      .execute();
    return userTagsResult;
  }

  async function addTagToUser(tagName: string): Promise<UserTagSelect> {
    "use server";
    try {
      const id = uuidv4();
      await db.insert(userTags).values({
        id: id,
        userId: user.id,
        name: tagName,
      });

      const tags = await db
        .select()
        .from(userTags)
        .where(eq(userTags.id, id))
        .execute();
      return tags[0];
    } catch (error) {
      console.error("Error adding tag to user:", error);
      throw new Error("Error adding tag to user");
    }
  }

  return (
    <div>
      <TagsClient
        initialTags={await getUserTags(user.id)}
        createTag={addTagToUser}
      />
    </div>
  );
}
