import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { eq } from "drizzle-orm/expressions";
import { users, userPrompt } from "@/types/schema";
import db from "@/db";
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
  }

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { prompt } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  await db.insert(userPrompt).values({
    id: uuidv4(),
    userId: user.id,
    prompt,
  });

  return NextResponse.json({ success: true });
}
