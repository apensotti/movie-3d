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
import { useRouter } from "next/navigation";
import { top200 } from "@/data/top200";
import MovieCardMd from "@/components/component/MovieCardMd";

export default function AIPage() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const session = sessionData;
  const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
  const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL!;
  const OMBDKEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY!;

  const [query, setQuery] = useState<string>("");
  const [ids, setIds] = useState<string[]>(top200);
  const [movies, setMovies] = useState<omdb[]>([]);
  const [showForceGraph, setShowForceGraph] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) {
      router.refresh();
    }
  }, [session]);
  
  useFetchMovieIDs(query, MWAPI, setIds);

  useFetchMovies(ids, OMBDAPI, OMBDKEY, setMovies);

  const handleSubmit = async () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      setQuery(inputValue);

      const message = await fetch(`${MWAPI}/search/similarity/?query=${inputValue}`)
      const ids = await message.json();
      setIds(ids);

      inputRef.current.value = '';
    }
  }

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        {showForceGraph ? <Matrix ids={ids} /> : <div>Force graph is hidden</div>}

        {/* Input field connected to Vercel AI SDK */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-96 pb-2 z-50">
          <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Summon the Wizard..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSubmit();
            }}
            ref={inputRef}
          />
        </div>
        {/* Render ContentPopup */}
        <ContentPopup movies={movies}>
            <MovieCardMd movies={movies} usePagination={false}/>
        </ContentPopup>
      </div>
    </>
  );
}
