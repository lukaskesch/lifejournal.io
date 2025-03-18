'use client';

import { useState } from 'react';
import { UserPromptSelect } from '@/types/database-types';

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
        <button
          type="button"
          onClick={() => {
            setEditedPrompt(question.prompt);
            setIsEditing(false);
          }}
          className="px-3 py-1 text-gray-600 hover:text-gray-800 rounded whitespace-nowrap"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap"
          disabled={isSubmitting || editedPrompt.trim() === question.prompt}
        >
          Save
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4 w-full">
      <p className="text-lg flex-1">{question.prompt}</p>
      <div className="flex gap-2 whitespace-nowrap">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
        >
          Edit
        </button>
        <form action={onDelete}>
          <button
            type="submit"
            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
