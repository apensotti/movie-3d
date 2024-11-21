"use client"

import { omdb } from '@/data/types'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const DailyMovieCard = ({movie}: {movie: omdb}) => {
  return (
    <div className="w-full max-w-full">
      <Card className="bg-neutral-800 text-white border-neutral-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl mb-2">{movie.Title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm lg:text-base xl:text-lg text-neutral-400">
                {movie.Year} • {movie.Runtime} • {movie.Rated}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm sm:text-base lg:text-lg xl:text-xl w-fit">
              IMDb {movie.imdbRating}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-auto flex justify-center sm:block">
              <img 
                src={movie.Poster} 
                className="object-cover rounded-lg h-auto w-[200px] sm:w-[150px] md:w-[200px]"
                alt={movie.Title}
              />
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-neutral-300">{movie.Plot}</p>
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base lg:text-lg xl:text-xl">Director</h3>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-neutral-300">{movie.Director}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base lg:text-lg xl:text-xl">Cast</h3>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-neutral-300">{movie.Actors}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base lg:text-lg xl:text-xl">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.Genre.split(', ').map((genre) => (
                    <Badge key={genre} className="bg-neutral-700 rounded-full text-white text-xs sm:text-sm lg:text-base xl:text-lg">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-xs sm:text-sm lg:text-base xl:text-lg text-neutral-400">
          Awards: {movie.Awards}
        </CardFooter>
      </Card>
    </div>
  )
}

export default DailyMovieCard