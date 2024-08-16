"use server";

import { db } from "../../../../db";
import { user_tags, users, UserTags } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm/expressions";
import { v4 as uuidv4 } from "uuid";
import TagsClient from "@/components/tags/TagsClient";
import { headers } from "next/headers";

export default async function Tags() {
  headers();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, "lukas.kesch@gmail.com"))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  async function getUserTags(userId: string) {
    const userTags = await db
      .select()
      .from(user_tags)
      .where(eq(user_tags.user_id, userId))
      .execute();
    return userTags;
  }

  async function addTagToUser(tagName: string): Promise<UserTags> {
    "use server";
    try {
      const id = uuidv4();
      await db.insert(user_tags).values({
        id: id,
        user_id: user.id,
        name: tagName,
      });

      const tags = await db
        .select()
        .from(user_tags)
        .where(eq(user_tags.id, id))
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
