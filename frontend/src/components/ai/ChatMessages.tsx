import React, { useEffect, useRef } from "react";
import { Message } from "./ChatMessage";
import { MessageSquare } from "lucide-react";
import { type Message as TMessage } from "ai/react";

interface MessagesProps {
  messages?: TMessage[];
  logging?: string;
  isLoading?: boolean;
}

export const Messages = ({ messages, logging, isLoading }: MessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  console.log("CHAT MESSAGES", messages);

  return (
    <div className="flex flex-col overflow-y-auto h-[calc(100vh-4rem)] no-scrollbar">
      {messages && messages.length ? (
        <>
          {messages.map((message, i) => (
            <Message
              key={i}
              content={message.content}
              message={message}
              logging={logging}
              isLoading={isLoading}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
          <MessageSquare className="size-8 text-orange-500" />
          <h3 className="font-semibold text-xl text-white">You're all set!</h3>
          <p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  );
};
