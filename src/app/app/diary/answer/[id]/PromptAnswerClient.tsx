'use client'
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { promptAnswer, userPrompt } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Toolbar from "@/components/layout/toolbar";

type Props = {
  answer: typeof promptAnswer.$inferSelect;
  prompt: typeof userPrompt.$inferSelect;
};

export default function PromptAnswerClient({ answer, prompt }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(answer.answer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    if (editedAnswer.trim() === answer.answer || isSubmitting) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/diary/answer/${answer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer: editedAnswer }),
      });

      if (!response.ok) {
        throw new Error("Failed to update answer");
      }

      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/diary/answer/${answer.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete answer");
      }

      router.push("/app/diary");
      router.refresh();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  return (
    <div>
      <Toolbar>
        <div className="font-bold text-lg">Diary Entry</div>
        <div className="flex flex-row items-center gap-4">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Entry</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this diary entry? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </Toolbar>

      <div className="max-w-xl mx-auto px-2 mt-10">
        <Card className="p-6">
          <div className="flex flex-row gap-2 items-center justify-between mb-4">
            <div className="font-bold text-lg">{prompt.prompt}</div>
            <div className="text-sm text-gray-500">
              {new Date(answer.createdAt).toLocaleDateString()}
            </div>
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-4">
              <Textarea
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedAnswer(answer.answer);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={isSubmitting}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{answer.answer}</div>
          )}
        </Card>
      </div>
    </div>
  );
}
