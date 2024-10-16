'use client';

import { ChatInterface } from '@/components/ai/ChatInterface';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export default function Page() {
  return (
    <div className="flex flex-col h-screen">
      <ChatInterface className="flex-grow" />
    </div>
  );
}