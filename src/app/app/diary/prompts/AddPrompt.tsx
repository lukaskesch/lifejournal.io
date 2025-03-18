'use client';

import { useState } from 'react';
import { addPrompt } from './actions';
import { Button } from '@/components/ui/button';

export default function AddPrompt() {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPrompt = async () => {
    if (!prompt.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addPrompt(prompt);
      setPrompt('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          New Prompt
        </label>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddPrompt();
        }} className="flex gap-2">
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="border rounded-md p-2 flex-1"
            placeholder="Enter your prompt..."
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            disabled={!prompt.trim() || isSubmitting}
          >
            Add Prompt
          </Button>
        </form>

      </div>
    </div>
  );
}
