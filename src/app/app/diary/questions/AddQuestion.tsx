'use client';

import { useState } from 'react';
import { addQuestion } from './actions';

export default function AddQuestion() {
  const [prompt, setPrompt] = useState('');

  const handleAddQuestion = async () => {
    if (prompt.trim()) {
      await addQuestion(prompt);
      setPrompt('');
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
        <button
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Question
        </button>
      </div>
    </div>
  );
}
