"use client";

import { UserPromptSelect } from "@/types/database-types";
import React from "react";
import { Button } from "../ui/button";

export default function AnswerPrompts({
  prompts,
  logPromptAnswer,
}: {
  prompts: UserPromptSelect[];
  logPromptAnswer: (promptId: string, answer: string) => Promise<void>;
  }) {
  const [activePromptIndex, setActivePromptIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");

  return (
    <div className="flex flex-col gap-4 max-w-xl mx-auto px-2 min-h-screen mt-10">
      <h1 className="text-2xl font-bold">{prompts[activePromptIndex].prompt}</h1>
      <textarea className="w-full min-h-60 p-2 border border-gray-300 rounded-md" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <div className="flex flex-row gap-4 justify-end">

        <Button onClick={() => {
        setActivePromptIndex(activePromptIndex === prompts.length - 1 ? 0 : activePromptIndex + 1)
        setAnswer("")
      }}>Skip</Button>
      <Button onClick={async () => {
        await logPromptAnswer(prompts[activePromptIndex].id, answer)
        setActivePromptIndex(activePromptIndex === prompts.length - 1 ? 0 : activePromptIndex + 1)
        setAnswer("")
      }}>Save</Button>
      </div>
    </div>
  );
}
