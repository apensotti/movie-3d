import { Message } from "./ChatMessage";
import { MessageSquare } from "lucide-react";
import { type Message as TMessage } from "ai/react";
import { ClientMessage } from "@/lib/actions/actions";

interface MessagesProps {
  messages?: ClientMessage[] | TMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  console.log(messages);
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y no-scrollbar">
      {messages && messages.length ? (
        messages.map((message, i) => {
          // Type narrowing to handle both ClientMessage and TMessage
          const content =
            "display" in message ? message.display : "content" in message ? message.content : "";
          
          return (
            <Message
              key={i}
              content={content}
              isUserMessage={message.role === "user"}
            />
          );
        })
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 translate-y-16">
          <MessageSquare className="size-8 text-orange-500" />
          <h3 className="font-semibold text-xl text-white">You're all set!</h3>
          <p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  );
};
