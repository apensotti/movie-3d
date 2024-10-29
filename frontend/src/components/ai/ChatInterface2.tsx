'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientMessage } from '@/lib/actions/actions';
import { useActions, useUIState } from 'ai/rsc';
import { useChat } from 'ai/react';
import { CoreMessage, generateId, Message } from 'ai';
import { Input } from '@/components/ui/input';
import { Messages } from '@/components/ai/ChatMessages';
import { AI } from './ai'
import { unstable_noStore as noStore } from 'next/cache';
import { createSession, updateSession } from '@/app/(chat)/actions';
export const maxDuration = 30;
export const dynamic = 'force-dynamic';
import { Session } from 'next-auth';
import { convertToUIMessages } from '@/lib/utils';

interface ChatInterfaceProps {
  className?: string;
  inputScale?: number;
  session_id: string;
  session?: Session | null;
  initialMessages?: CoreMessage[];
}

const MWAPI = process.env.NEXT_PUBLIC_MWAPI;

export function ChatInterface({session_id, session, initialMessages, className = '', inputScale = 110 }: ChatInterfaceProps) {
  noStore();
  const [logging, setLogging] = useState('thinking...');
  const [toolLogging, setToolLogging] = useState(false);
  const prevLoggingRef = useRef(logging);
  
  const { messages, input, handleInputChange, handleSubmit, error, isLoading, reload, stop } = useChat({
    api: '/api/chat',
    body: {
      session_id: session_id,
    },
    initialMessages: convertToUIMessages(initialMessages as Array<CoreMessage>),
    onError(error) {
      console.log(error);
    },
    onToolCall(toolCall) {
      const newLogging = toolCall.toolCall.toolName;
      if (newLogging !== prevLoggingRef.current) {
        if (newLogging === 'getActorInfo') {
          setLogging('getting actor info');
        } else if (newLogging === 'searchMovies') {
          setLogging('searching movies');
        } else if (newLogging === 'getMovieReview') {
          setLogging('getting movie review');
        } else if (newLogging === 'describeMovie') {
          setLogging('searching similar movies');
        } else {
          setLogging(newLogging);
        }
      }
    },
    onResponse(response) {
      if (prevLoggingRef.current !== 'text') {
        setLogging('text');
      }
    },
    async onFinish() {
      window.history.replaceState({}, '', `/chat/${session_id}`);
      console.log("FINISHED", messages);
    },
  });

  useEffect(() => {
    prevLoggingRef.current = logging;
  }, [logging]);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto mb-4 no-scrollbar rounded-lg">
        <Messages messages={messages} logging={logging} isLoading={isLoading} />
      </div>

      {/* Input container */}
      <div className={`w-full flex justify-center pb-4 scale-${inputScale}`}>
        <div className={`w-1/3 relative`}>
          <Input
            type="text"
            className={`w-full rounded-full pr-10`}
            placeholder="Summon the Wizard..."
            value={input}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            isLoading={isLoading}
            stop={stop}
            onChange={handleInputChange}
            onArrowClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
