'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientMessage } from '@/lib/actions/actions';
import { useActions, useUIState } from 'ai/rsc';
import { useChat } from 'ai/react';
import { generateId } from 'ai';
import { Input } from '@/components/ui/input';
import { Messages } from '@/components/ai/ChatMessages';

interface ChatInterfaceProps {
  className?: string;
  inputScale?: number;
}

export function ChatInterface({ className = '', inputScale = 1 }: ChatInterfaceProps) {
  const [logging, setLogging] = useState('thinking...');
  const [toolLogging, setToolLogging] = useState(false);
  const prevLoggingRef = useRef(logging);
  
  const { messages, input, handleInputChange, handleSubmit, error, isLoading, reload, stop } = useChat({
    api: '/api/chat',
    onError(error) {
      console.log(error);
    },
    onToolCall(toolCall) {
      const newLogging = toolCall.toolCall.toolName;
      if (newLogging !== prevLoggingRef.current) {
        if (newLogging === 'getActorInfo') {
          setLogging('getting actor info...');
        } else if (newLogging === 'searchMovies') {
          setLogging('searching movies...');
        } else if (newLogging === 'getMovieReview') {
          setLogging('getting movie review...');
        } else if (newLogging === 'describeMovie') {
          setLogging('searching similar movies...');
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
    // onFinish(event) {
    //   console.log(event);
    // },
  });

  useEffect(() => {
    prevLoggingRef.current = logging;
  }, [logging]);

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Messages container */}
      <div className="flex-grow overflow-y-auto mb-4 no-scrollbar rounded-lg">
        <Messages messages={messages} logging={logging} isLoading={isLoading} />
      </div>

      {/* Input container */}
      <div className={`w-full flex justify-center pb-4 scale-${inputScale}`}>
        <div className={`w-1/3 relative` }>
          <Input
            type="text"
            className={`w-full h-10 rounded-full pr-10`}
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
