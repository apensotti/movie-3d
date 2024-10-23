import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React, { useState } from "react";
import { FaHatWizard } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { type Message as TMessage } from "ai/react";
import { ActorInfo } from "./ui/actor";
import MovieCardMd from "../component/MovieCardMd";


const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;

interface MessageProps {
  content: React.ReactNode | string;
  message: TMessage;
  logging?: string;
  isLoading?: boolean;
  toolLogging?: boolean;
}

const preprocessMarkdown = (content: string) => {
  return content.replace(/\n/g, '  \n')
}

export const Message = ({ content, message, logging, isLoading }: MessageProps) => {
  const isUserMessage = message.role === 'user';
  const isAssistantMessage = message.role === 'assistant';

  return (
    <div
      // className={cn({
      //   "bg-neutral-900": isUserMessage,
      //   "bg-neutral-900": isAssistantMessage,
      // })}
      className={`bg-neutral-900`}
    >
      <div className="p-6">
        <div className="max-w-3xl mx-auto flex items-start gap-2.5">
          <div
            className={cn(
              "size-6 shrink-0 aspect-square rounded-full border border-orange-700 bg-orange-900 flex justify-center items-center",
              {
                "bg-violet-950 border-violet-500 text-zinc-200": isUserMessage,
              }
            )}
          >
            {isUserMessage && (
              <User className="size-3" />
            )}
            {isAssistantMessage && (
              <FaHatWizard className="size-3 text-white" />
            )}
          </div>

          <div className="flex flex-col ml-6 w-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">
              </span>
            </div>

            <div className="max-w-none">
              {
              message.toolInvocations ? (
                message.toolInvocations.map((toolInvocation) => {
                  const { toolName, toolCallId, state } = toolInvocation;
                  

                  if (state === 'result') {
                    if (toolName === 'getActorInfo') {
                      const { result } = toolInvocation;
                      return (
                        <div key={toolCallId}>
                          <ActorInfo actor={result.tmdb} imageUrl={result.imageUrl} movies={result.movies} data={result.data} />
                        </div>
                      );
                    } else if (toolName === 'searchMovies' || toolName === 'describeMovie') {
                      const { result } = toolInvocation;
                      return (
                        <div key={toolCallId}>
                          {}
                          <MovieCardMd movies={result} />
                        </div>
                      );
                    } else if (toolName === 'getMovieReview') {
                      const { result } = toolInvocation;
                      return (
                        <div key={toolCallId}>
                          <ReactMarkdown className="font-light font-sm whitespace-pre-line">{result.content}</ReactMarkdown>
                        </div>
                      );
                    }
                  } else {
                    return (
                      <div key={toolCallId}>
                        <p className="text-sm text-zinc-500">{logging}</p>
                      </div>
                    );
                  }
                  return null;
                })
              ) : <ReactMarkdown className="font-light font-sm whitespace-pre-line">{message.content}</ReactMarkdown>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};