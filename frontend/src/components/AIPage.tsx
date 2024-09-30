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

interface AIPageProps {
  session: any;
}

export default function AIPage({ session }: AIPageProps) {
  const router = useRouter();

  const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
  const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
  const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;

  const [query, setQuery] = useState<string>("");
  const [ids, setIds] = useState<string[]>([
    "tt0114709", "tt0113497", "tt0113228", "tt0114885", "tt0113041", "tt6209470", "tt2028550", "tt0303758",
  ]);
  const [movies, setMovies] = useState<omdb[]>([]);
  const [showForceGraph, setShowForceGraph] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

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
        <Input
          type="text"
          className="w-full rounded-full align-middle"
          placeholder="Summon the Wizard..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSubmit(); // Submit input on Enter
          }}
          onChange={handleInputChange}
          value={input}
          ref={inputRef}
        />

        {/* Render ContentPopup */}
        <ContentPopup movies={movies}>
          <Messages messages={messages} />
        </ContentPopup>
      </div>
    </>
  );
}
