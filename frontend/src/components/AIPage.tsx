"use client";

import React, { useState, useRef, useEffect, use } from "react";
import Matrix from "@/components/matrix";
import ContentPopup from "@/components/ContentPopup";
import { Input } from "@/components/ui/input";
import { GraphData, omdb } from "@/data/types";
import {
  useLoadQueryFromLocalStorage,
  useFetchGraphData,
  useFetchMovieIDs,
  useFetchMovies,
  useSaveQueryToServer,
} from "@/hooks/hooks";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import LoginSignupAvatar from "@/components/auth/LoginSignupAvatar";
import { set } from "mongoose";
import LoginSignup from "@/components/LoginSignup";
import { AccountAvatar } from "@/components/AccountAvatar";
import { useRouter } from "next/navigation";

interface AIPageProps {
  session: any;
}

export default function AIPage({ session }: AIPageProps) {
  const router = useRouter(); 

  const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
  const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
  const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;

  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [ids, setIds] = useState<string[]>([
    "tt0114709", "tt0113497", "tt0113228", "tt0114885", "tt0113041", "tt6209470", "tt2028550", "tt0303758",
  ]);
  const [movies, setMovies] = useState([] as omdb[]);
  const [showForceGraph, setShowForceGraph] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) {
      router.refresh();
    }
  }, [session]);

  useLoadQueryFromLocalStorage(setQuery);
  useFetchGraphData(ids, MWAPI, setData);
  useFetchMovieIDs(query, MWAPI, setIds);
  useFetchMovies(ids, OMBDAPI, OMBDKEY, setMovies);
  useSaveQueryToServer(query, MWAPI);

  const handleArrowClick = () => {
    if (inputRef.current) {
      setQuery(inputRef.current.value);
    }
  };

  return (
    <>
        <div className="absolute top-6 right-6 z-50">
            {!session?.user ? (
              <LoginSignup />
            ) : session?.user ? (
              <AccountAvatar imageLink={session.user?.image}/>
            ) : (
              <LoginSignup />
            )}
        </div>
        <div className="relative w-screen h-screen overflow-hidden">
        {showForceGraph ? <Matrix nodes={data.nodes} links={data.links} /> : <div>Force graph is hidden</div>}

        <Input
          type="text"
          className="w-full rounded-full align-middle"
          placeholder="Summon the Wizard..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleArrowClick();
          }}
          defaultValue={query}
          ref={inputRef}
        />

        <ContentPopup movies={movies} />
      </div>
    </>
  );
}
