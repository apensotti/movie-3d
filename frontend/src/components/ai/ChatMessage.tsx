"use client";

import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaHatWizard } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { type Message as TMessage } from "ai/react";
import { ActorInfo } from "./ui/actor";
import MovieCardMd from "../component/MovieCardMd";
import { LoadingState } from "./ui/stateLoading";


const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;

interface MessageProps {
  content: React.ReactNode | string;
  message: TMessage;
  logging?: string;
  isLoading?: boolean;
  toolLogging?: boolean;
  bg?: string;
}

const preprocessMarkdown = (content: string) => {
  return content.replace(/\n/g, '  \n')
}

export const Message = ({ content, message, logging, isLoading, bg }: MessageProps) => {
  const isUserMessage = message.role === 'user';
  const isAssistantMessage = message.role === 'assistant';

  const [streamedContent, setStreamedContent] = useState<string>('');

  // useEffect(() => {
  //   let currentContent = '';
  //   const interval = setInterval(() => {
  //     if (currentContent.length < message.content.length) {
  //       currentContent += message.content[currentContent.length];
  //       setStreamedContent(currentContent);
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 10); // Adjust the interval time as needed for streaming effect

  //   return () => clearInterval(interval);
  // }, [message.content]);

  return (
    <div className={`bg-neutral-${bg}`}>
      <div className={`p-6`}>
        <div className="max-w-3xl mx-auto flex items-start gap-2.5">
          <div
            className={cn(
              "size-6 shrink-0 aspect-square rounded-full border border-orange-700 bg-orange-900 flex justify-center items-center",
              {
                "bg-violet-950 border-violet-500 text-zinc-200": isUserMessage,
                "bg-transparent border-transparent": isAssistantMessage && message.content === ''
              }
            )}
          >
            {isUserMessage && (
              <User className="size-3" />
            )}
            {isAssistantMessage && message.content !== '' && (
              <FaHatWizard className="size-3 text-white" />
            )}
          </div>

          <div className="flex flex-col ml-6 w-full">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-white">
              </span>
            </div>

            <div className="max-w-none">
              <ReactMarkdown className="font-light font-sm whitespace-pre-line">{message.content}</ReactMarkdown>
              {message.toolInvocations && message.toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === 'result') {
                  if (toolName === 'getActorInfo') {
                    const { result } = toolInvocation;
                    return result && result.tmdb && result.tmdb.name ? (
                      <div key={toolCallId}>
                        <ActorInfo actor={result.tmdb} imageUrl={result.imageUrl} movies={result.movies} data={result.data} />
                      </div>
                    ) : null;
                  } else if (toolName === 'searchMovies' || toolName === 'describeMovie') {
                    const { result } = toolInvocation;
                    return result ? (
                      <div key={toolCallId}>
                        <MovieCardMd movies={result} />
                      </div>
                    ) : null;
                  } else if (toolName === 'getMovieReview') {
                    const { result } = toolInvocation;
                    return result ? (
                      <div key={toolCallId}>
                        <ReactMarkdown className="font-light font-sm whitespace-pre-line">{message.content}</ReactMarkdown>
                      </div>
                    ) : null;
                  }
                } else {
                  return (
                    <div style={{ transform: 'translate(0px, -45px)' }}>
                      <LoadingState key={toolCallId} logging={logging}/>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
