"use client"

import { tmdb } from '@/data/types'
import Link from 'next/link';
import React from 'react'

const TMDB_IMAGE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL;

const PopularMoviesBy = ({movies, onYearChange}: {movies:tmdb[], onYearChange: (year: number) => void}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({length: currentYear - 1920 + 1}, (_, i) => currentYear - i);

  return (
    <div className="w-full">
      <div className="mb-4">
        <select 
          className="bg-neutral-700 text-white rounded-lg px-3 py-2 text-sm md:text-base"
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          defaultValue={currentYear}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full bg-neutral-800 text-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex flex-row flex-nowrap gap-3 md:gap-4 p-3 md:p-4">
            {movies.map((movie) => (
              <Link href={`/movies/${movie.imdb_id}`} key={movie.id}>
                <div className="rounded-lg bg-neutral-700 overflow-hidden w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                  <img 
                    src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full aspect-[2/3] object-cover"
                  />
                  <div className="p-2 sm:p-3 md:p-4">
                    <h3 className="font-medium text-sm sm:text-base md:text-lg truncate">{movie.title}</h3>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm md:text-base">{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopularMoviesBy