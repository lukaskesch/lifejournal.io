'use client';

import { useState } from 'react';
import { UserPromptSelect } from '@/types/database-types';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/alert-dialog';

interface EditPromptProps {
  prompt: UserPromptSelect;
  onDelete: () => Promise<void>;
  onUpdate: (prompt: string) => Promise<void>;
}

export default function EditPrompt({ prompt, onDelete, onUpdate }: EditPromptProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt.prompt);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPrompt.trim() === prompt.prompt) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(editedPrompt);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <input
          type="text"
          value={editedPrompt}
          onChange={(e) => setEditedPrompt(e.target.value)}
          className="flex-1 p-2 border rounded-md text-lg"
          disabled={isSubmitting}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setEditedPrompt(prompt.prompt);
            setIsEditing(false);
          }}
          disabled={isSubmitting}
          size="sm">
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || editedPrompt.trim() === prompt.prompt}
          size="sm">
          Save
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4 w-full">
      <p className="text-lg flex-1">{prompt.prompt}</p>
      <div className="flex gap-2 whitespace-nowrap">
        <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-800 hover:bg-red-100">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete prompt and all its answers?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this prompt and all answers associated with it. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <form action={onDelete}>
                <AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
