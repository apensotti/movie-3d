'use client';

import { useState } from 'react';
import { ClientMessage, submitMessage } from '@/lib/actions/actions2';
import { useActions } from 'ai/rsc';
import { Input } from '@/components/ui/input';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ClientMessage[]>([]);

  const handleSubmission = async () => {
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: '123',
        status: 'user.message.created',
        text: input,
        gui: null,
      },
    ]);

    const response = await submitMessage(input);
    setMessages(currentMessages => [...currentMessages, response]);
    setInput('');
  };

  return (
    <div className="flex flex-col-reverse">
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-md pb-2 z-50 scale-125">
            <Input
              type="text"
              className="w-full rounded-full align-middle"
              placeholder="Summon the Wizard..."
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSubmission(); // Submit input on Enter
              }}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
      <div className="flex flex-col h-[calc(100dvh-56px)] overflow-y-scroll">
        <div>
          {messages.map(message => (
            <div key={message.id} className="flex flex-col gap-1 border-b p-2">
              <div className="flex flex-row justify-between">
                <div className="text-sm text-zinc-500">{message.status}</div>
              </div>
              <div className="flex flex-col gap-2">{message.gui}</div>
              <div>{message.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}