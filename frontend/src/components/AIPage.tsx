"use client";

import React, { useState, useRef, useEffect } from "react";
import Matrix from "@/components/matrix";
import ContentPopup from "@/components/ContentPopup";
import { Input } from "@/components/ui/input";
import { omdb } from "@/data/types";
import {
  useFetchMovieIDs,
  useFetchMovies,
} from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import LoginSignup from "@/components/LoginSignup";
import { AccountAvatar } from "@/components/AccountAvatar";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Messages } from "./ai/ChatMessages";
import { top200 } from "@/data/top200";

interface AIPageProps {
  session: any;
}

export default function AIPage({ session }: AIPageProps) {
  const router = useRouter();

  const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
  const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
  const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;

  const [query, setQuery] = useState<string>("");
  const [ids, setIds] = useState<string[]>(top200);
  const [movies, setMovies] = useState<omdb[]>([]);
  const [showForceGraph, setShowForceGraph] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log(setMovies)

  useEffect(() => {
    if (!session) {
      router.refresh();
    }
  }, [session]);

  // Using useCompletion from Vercel AI SDK
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  
  // Fetch movie IDs when query changes
  useFetchMovieIDs(query, MWAPI, setIds);

  // Fetch movie details when ids change
  useFetchMovies(ids, OMBDAPI, OMBDKEY, setMovies);

  return (
    <>
      <div className="absolute top-6 right-6 z-50">
        {!session?.user ? (
          <LoginSignup />
        ) : (
          <AccountAvatar imageLink={session.user?.image} />
        )}
      </div>

      <div className="relative w-screen h-screen overflow-hidden">
        {showForceGraph ? <Matrix ids={ids} /> : <div>Force graph is hidden</div>}

        {/* Input field connected to Vercel AI SDK */}
        <div className="absolute bottom-5 left-72 transform -translate-x-1/2 w-100 pb-2 z-50 scale-125">
          <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Describe a movie..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSubmit(); // Submit input on Enter
            }}
            onChange={handleInputChange}
            value={input}
            ref={inputRef}
          />
        </div>

        {/* Render ContentPopup */}
        <ContentPopup movies={movies}>
          <Messages messages={messages} />
        </ContentPopup>
      </div>
    </>
  );
}
