'use client';

import { useState } from 'react';
import { UserPromptSelect } from '@/types/database-types';
import { Button } from '@/components/ui/button';

interface EditQuestionProps {
  question: UserPromptSelect;
  onDelete: () => Promise<void>;
  onUpdate: (prompt: string) => Promise<void>;
}

export default function EditQuestion({ question, onDelete, onUpdate }: EditQuestionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(question.prompt);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedPrompt.trim() === question.prompt) {
      setIsEditing(false);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onUpdate(editedPrompt);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating question:', error);
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
            setEditedPrompt(question.prompt);
            setIsEditing(false);
          }}
          disabled={isSubmitting}
          size="sm"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || editedPrompt.trim() === question.prompt}
          size="sm"
        >
          Save
        </Button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4 w-full">
      <p className="text-lg flex-1">{question.prompt}</p>
      <div className="flex gap-2 whitespace-nowrap">
        <Button
          onClick={() => setIsEditing(true)}
          variant="ghost"
          size="sm"
        >
          Edit
        </Button>
        <form action={onDelete}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-800 hover:bg-red-100"
          >
            Delete
          </Button>
        </form>
      </div>
    </div>
  );
}
