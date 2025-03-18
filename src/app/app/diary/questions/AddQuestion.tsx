'use client';

import { useState } from 'react';
import { addQuestion } from './actions';
import { Button } from '@/components/ui/button';

export default function AddQuestion() {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestion = async () => {
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addQuestion(prompt);
      setPrompt('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          New Question
        </label>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border rounded-md p-2"
          placeholder="Enter your question..."
        />
        <Button
          onClick={handleAddQuestion}
          disabled={!prompt.trim() || isSubmitting}
        >
          Add Question
        </Button>
      </div>
    </div>
  );
}
