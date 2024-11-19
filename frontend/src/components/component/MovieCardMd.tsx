"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { SiRottentomatoes } from "react-icons/si";
import { omdb } from '../../data/types';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface MovieCardMdProps {
    movies: omdb[] | undefined;
}

function MovieCardMd({ movies }: MovieCardMdProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentMovies, setCurrentMovies] = useState<omdb[]>([]);
  const moviesPerPage = 10;

  useEffect(() => {
    if (movies && movies.length > 0) {
      const indexOfLastMovie = currentPage * moviesPerPage;
      const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
      setCurrentMovies(movies.slice(indexOfFirstMovie, indexOfLastMovie));
    }
  }, [currentPage, movies]);

  useEffect(() => {
    // Reset to first page when movies prop changes
    setCurrentPage(1);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return <div>No movies to display</div>;
  }

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  return (
    <div className='flex flex-col'>
      {totalPages > 1 && (
        <Pagination className='p-5'>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {currentMovies.map((movie : omdb) => (
        <Link href={`/movies/${movie.imdbID}`} key={movie.imdbID}>
          <div className='flex items-center justify-between pb-5 pt-5 gap-5 shadow-lg px-2 mt-2 bg-neutral-800 rounded-2xl hover:bg-violet-900 hover:rounded-2xl'>
            <div className='flex flex-row gap-2'>
              <img src={movie.Poster} alt={movie.Title} width={50} height={50} className='pl-2'/>
              <div className='flex flex-col'>
                <div className='flex flex-row gap-2'>
                  <h1 className='text-white font-semibold'>{movie.Title}</h1>
                  <h1 className='text-white font-regular pt-1 text-3xs'>{movie.Rated}</h1>
                </div>
                <h2 className='text-white font-thin text-2xs'>{movie.Year}</h2>
                <div className=''>
                  <h2 className='text-white font-thin text-2xs line-clamp-2'>{movie.Plot}</h2>
                </div>
              </div>
            </div>
            <div className='flex flex-row gap-1 pr-2'>
              <SiRottentomatoes className='text-red-500 text-sm' />
              <h2 className='text-white font-bold text-2xs -translate-y-[2px]'>{movie.Ratings[1]?.Value}</h2>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default MovieCardMd
