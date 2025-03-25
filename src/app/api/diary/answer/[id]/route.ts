import { authOptions } from "@/lib/authOptions";
import db from "@/db";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { promptAnswer, userPrompt } from "@/db/schema";
import { NextResponse } from "next/server";

async function verifyOwnership(answerId: string, userId: string) {
  if (!db) return false;
  
  const answer = await db
    .select()
    .from(promptAnswer)
    .where(eq(promptAnswer.id, answerId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  if (!answer) {
    return false;
  }

  const prompt = await db
    .select()
    .from(userPrompt)
    .where(eq(userPrompt.id, answer.promptId))
    .limit(1)
    .execute()
    .then((result) => result[0]);

  return prompt?.userId === userId;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isOwner = await verifyOwnership(params.id, userId);
  if (!isOwner) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { answer } = body;

  if (!answer || typeof answer !== "string") {
    return new NextResponse("Invalid request body", { status: 400 });
  }

  if (!db) {
    return new NextResponse("Database not initialized", { status: 500 });
  }

  await db
    .update(promptAnswer)
    .set({ answer })
    .where(eq(promptAnswer.id, params.id))
    .execute();

  return new NextResponse(null, { status: 200 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isOwner = await verifyOwnership(params.id, userId);
  if (!isOwner) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!db) {
    return new NextResponse("Database not initialized", { status: 500 });
  }

  await db
    .delete(promptAnswer)
    .where(eq(promptAnswer.id, params.id))
    .execute();

  return new NextResponse(null, { status: 200 });
}
