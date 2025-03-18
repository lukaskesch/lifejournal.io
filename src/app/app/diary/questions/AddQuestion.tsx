'use client';

import { useRef } from 'react';
import { addQuestion } from './actions';

export default function AddQuestion() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addQuestion(formData);
        formRef.current?.reset();
      }}
      className="mb-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium">
          New Question
        </label>
        <input
          type="text"
          id="prompt"
          name="prompt"
          className="border rounded-md p-2"
          placeholder="Enter your question..."
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Question
        </button>
      </div>
    </form>
  );
}
