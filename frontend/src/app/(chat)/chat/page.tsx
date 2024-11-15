'use client';

import { ChatInterface } from '@/components/ai/ChatInterface2';
import { generateId } from 'ai';

export default function Page() {
  const session_id = generateId();

  return (
    <div className="flex-grow flex flex-col overflow-hidden">
      <ChatInterface 
        className="flex-grow" 
        initialMessages={[]} 
        session_id={session_id} 
        chatBg="850"
        inputBg="900"
        messageBg="850"
      />
    </div>
  );
}
