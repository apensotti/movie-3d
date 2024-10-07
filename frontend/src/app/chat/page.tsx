'use client';

import { useState } from 'react';
import { ClientMessage } from '@/lib/actions/actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { Input } from '@/components/ui/input';
import { Messages } from '@/components/ai/ChatMessages';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  const handleSubmit = async () => {
    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      { id: generateId(), role: 'user', display: input },
    ]);

    const message = await continueConversation(input);

    setConversation((currentConversation: ClientMessage[]) => [
      ...currentConversation,
      message,
    ]);

    setInput('');
  }

  return (
    <div>
      <div>
        <Messages messages={conversation} />
      </div>

      

      <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-md pb-2 z-50 scale-125">
        <Input
          type="text"
          className="w-full rounded-full align-middle"
          placeholder="Summon the Wizard..."
          value={input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSubmit(); // Submit input on Enter
          }}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
}