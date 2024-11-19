'use client';

import { useState } from 'react';
import { ClientMessage } from '@/lib/actions/actions';
import { useActions, useUIState } from 'ai/rsc';
import { generateId } from 'ai';
import { Input } from '@/components/ui/input';
import { Messages } from '@/components/ai/ChatMessages';

interface ChatInterfaceProps {
  className?: string;
  inputScale?: number;
}

export function ChatInterface({ className = '', inputScale = 1 }: ChatInterfaceProps) {
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
    <div className={`flex flex-col ${className}`}>
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto mb-4 no-scrollbar rounded-lg">
        <Messages messages={conversation} />
      </div>

      {/* Input container */}
      <div className={`w-full flex justify-center pb-4 scale-${inputScale}`}>
        <div className={`w-1/3 relative` }>
          <Input
            type="text"
            className={`w-full h-8 rounded-full pr-10`}
            placeholder="Summon the Wizard..."
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            onChange={(e) => setInput(e.target.value)}
            onArrowClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
