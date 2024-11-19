"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { omdb } from '../../data/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import PosterButtons from './PosterButtons';

interface MovieCardSmProps {
    movies: omdb[];
}

import { useSession } from "next-auth/react";

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;

function MovieCardSm({ movies }: MovieCardSmProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 64; // 8x8 grid
  const { data: session } = useSession();
  const [libraryMovies, setLibraryMovies] = useState<string[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserLists = async () => {
      const userEmail = session?.user?.email;
      if (!userEmail) return;

      try {
        const libraryResponse = await fetch(`${MWAPI}/users/${userEmail}/library`);
        const watchlistResponse = await fetch(`${MWAPI}/users/${userEmail}/watchlist`);

        if (libraryResponse.ok && watchlistResponse.ok) {
          const libraryData = await libraryResponse.json();
          const watchlistData = await watchlistResponse.json();
          setLibraryMovies(libraryData);
          setWatchlistMovies(watchlistData);
        }
      } catch (error) {
        console.error("Error fetching user lists:", error);
      }
    };

    fetchUserLists();
  }, [session]);

  const handleLibraryClick = async (imdbID: string) => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;

    const action = libraryMovies.includes(imdbID) ? 'remove' : 'add';
    try {
      const response = await fetch(`${MWAPI}/users/${userEmail}/library/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imdbID }),
      });
      if (response.ok) {
        setLibraryMovies(prev => 
          action === 'add' ? [...prev, imdbID] : prev.filter(id => id !== imdbID)
        );
        if (action === 'add') {
          setWatchlistMovies(prev => prev.filter(id => id !== imdbID));
        }
      }
    } catch (error) {
      console.error("Error updating library:", error);
    }
  };

  const handleWatchlistClick = async (imdbID: string) => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;

    const action = watchlistMovies.includes(imdbID) ? 'remove' : 'add';
    try {
      const response = await fetch(`${MWAPI}/users/${userEmail}/watchlist/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imdbID }),
      });
      if (response.ok) {
        setWatchlistMovies(prev => 
          action === 'add' ? [...prev, imdbID] : prev.filter(id => id !== imdbID)
        );
        if (action === 'add') {
          setLibraryMovies(prev => prev.filter(id => id !== imdbID));
        }
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-5 gap-4'>
        {currentMovies.map((movie : omdb) => (
          <div key={movie.imdbID}>
            <PosterButtons
              posterLink={movie.Poster}
              onLibraryClick={() => handleLibraryClick(movie.imdbID)}
              onWatchlistClick={() => handleWatchlistClick(movie.imdbID)}
              inLibrary={libraryMovies.includes(movie.imdbID)}
              inWatchlist={watchlistMovies.includes(movie.imdbID)}
              width="100%"
              height="auto"
            />
            <h2 className='text-white text-center mt-2 text-xs font-bold'>{movie.Title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieCardSm
