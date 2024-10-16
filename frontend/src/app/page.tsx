"use client";

import React, { useState, useRef, useEffect } from "react";
import Matrix from "@/components/component/matrix";
import ContentPopup from "@/components/component/ContentPopup";
import { Input } from "@/components/ui/input";
import { omdb } from "@/data/types";
import {
  useFetchMovieIDs,
  useFetchMovies,
} from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import LoginSignup from "@/components/auth/LoginSignup";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { Messages } from "@/components/ai/ChatMessages";
import { top200 } from "@/data/top200";
import { ClientMessage, continueConversation } from "@/lib/actions/actions";
import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import LoginSignupAvatar from "@/components/auth/LoginSignupAvatar";

export default function AIPage() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const session = sessionData;
  const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
  const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
  const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;

  const [query, setQuery] = useState<string>("");
  const [ids, setIds] = useState<string[]>(top200);
  const [movies, setMovies] = useState<omdb[]>([]);
  const [showForceGraph, setShowForceGraph] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  console.log(setMovies)

  useEffect(() => {
    if (!session) {
      router.refresh();
    }
  }, [session]);
  
  // Fetch movie IDs when query changes
  useFetchMovieIDs(query, MWAPI, setIds);

  // Fetch movie details when ids change
  useFetchMovies(ids, OMBDAPI, OMBDKEY, setMovies);


  const handleSubmit = async () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      setQuery(inputValue);
      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        { id: generateId(), role: 'user', display: inputValue },
      ]);

      const message = await continueConversation(inputValue);

      setConversation((currentConversation: ClientMessage[]) => [
        ...currentConversation,
        message,
      ]);

      inputRef.current.value = '';
    }
  }


  return (
    <>
      {/* <LoginSignupAvatar session={session}/> */}

      <div className="relative w-screen h-screen overflow-hidden">
        {showForceGraph ? <Matrix ids={ids} /> : <div>Force graph is hidden</div>}

        {/* Input field connected to Vercel AI SDK */}
        <div className="absolute bottom-5 left-72 transform -translate-x-1/2 w-100 pb-2 z-50 scale-125">
          <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Summon the Wizard..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSubmit(); // Submit input on Enter
            }}
            ref={inputRef}
          />
        </div>
        {/* Render ContentPopup */}
        <ContentPopup movies={movies}>
          <Messages messages={conversation} />
        </ContentPopup>
      </div>
    </>
  );
}
function setConversation(arg0: (currentConversation: ClientMessage[]) => ClientMessage[]) {
  throw new Error("Function not implemented.");
}
