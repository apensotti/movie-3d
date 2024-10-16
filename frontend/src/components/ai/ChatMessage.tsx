import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React from "react";
import { FaHatWizard } from "react-icons/fa";

interface MessageProps {
  content: React.ReactNode | string;
  isUserMessage: boolean;
}

export const Message = ({ content, isUserMessage }: MessageProps) => {
  return (
    <div
      className={cn({
        "bg-neutral-800": isUserMessage,
        "bg-neutral-900/25": !isUserMessage,
      })}
    >
      <div className="p-6">
        <div className="max-w-3xl mx-auto flex items-start gap-2.5">
          <div
            className={cn(
              "size-10 shrink-0 aspect-square rounded-full border border-orange-700 bg-orange-900 flex justify-center items-center",
              {
                "bg-violet-950 border-violet-500 text-zinc-200": isUserMessage,
              }
            )}
          >
            {isUserMessage ? (
              <User className="size-5" />
            ) : (
              <FaHatWizard className="size-5 text-white" />
            )}
          </div>

          <div className="flex flex-col ml-6 w-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">
                {isUserMessage ? "You" : "The Wizard"}
              </span>
            </div>

            <div className="prose prose-invert max-w-none">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};