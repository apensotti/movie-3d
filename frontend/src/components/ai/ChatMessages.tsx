import { Message } from "./ChatMessage";
import { MessageSquare } from "lucide-react";
import { type Message as TMessage } from "ai/react";
import { ClientMessage } from "@/lib/actions/actions";
import { ActorInfo } from "./ui/actor";

interface MessagesProps {
  messages?: TMessage[];
  logging?: string;
  isLoading?: boolean;
}

export const Messages = ({ messages, logging, isLoading }: MessagesProps) => {
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y no-scrollbar">
      {messages && messages.length ? (
        messages.map((message, i) => {
          return (
            <>
              <Message
                key={i}
              content={message.content}
              message={message}
              logging={logging}
              isLoading={isLoading}
            />
            
            </>
          );
        })
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
