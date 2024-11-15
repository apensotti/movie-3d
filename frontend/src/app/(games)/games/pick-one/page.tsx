'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { omdb } from '@/data/types';
import { Button } from '@/components/ui/button';

const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY;
const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;

export default function PickOnePage() {
  const [movies, setMovies] = useState<{ imdbID: string; Poster: string; Overview: string; Title: string }[]>([]);
  const { data: session } = useSession();
  const [selectedMovie, setSelectedMovie] = useState<{ imdbID: string; Poster: string; Overview: string; Title: string }>();

  const fetchRandomMovies = async () => {
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) return;

      const recommendations = await fetch(`${MWAPI}/search/recommendations/?email=${userEmail}&library_bool=${true}&exclusive=${true}`)
      
      if (!recommendations.ok) throw new Error('Failed to fetch recommendations');

      const randomImdbIDs: string[] = await recommendations.json();
      const shuffled = randomImdbIDs.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2);

      const moviePromises = selected.map(imdbID =>
        fetch(`${OMBDAPI}?i=${imdbID}&apikey=${OMDB_API_KEY}`)
          .then(res => res.json())
          .then(data => ({ imdbID: data.imdbID, Poster: data.Poster, Overview: data.Plot, Title: data.Title }))
      );

      const movieData = await Promise.all(moviePromises);
      setMovies(movieData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchRandomMovies();
  }, []);

  const handlePick = async (pickedMovie: { imdbID: string; Poster: string; Overview: string; Title: string }) => {
    setSelectedMovie(pickedMovie);
    const userEmail = session?.user?.email;
    if (!userEmail) return;

    try {
      const recommendations = await fetch(`${MWAPI}/search/recommendations/?email=${userEmail}&library_bool=${true}&exclusive=${true}`)
      
      if (!recommendations.ok) throw new Error('Failed to fetch recommendations');

      const randomImdbIDs: string[] = await recommendations.json();
      const shuffled = randomImdbIDs.sort(() => 0.5 - Math.random());
      const newMovieID = shuffled.find(id => id !== pickedMovie.imdbID);

      if (newMovieID) {
        const newMovieResponse = await fetch(`${OMBDAPI}?i=${newMovieID}&apikey=${OMDB_API_KEY}`);
        const newMovieData = await newMovieResponse.json();
        setMovies([{ ...pickedMovie }, { imdbID: newMovieData.imdbID, Poster: newMovieData.Poster, Overview: newMovieData.Plot, Title: newMovieData.Title }]);
      }
    } catch (error) {
      console.error("Error fetching new movie:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-neutral-900">
      <h1>{selectedMovie?.Title}</h1>
      <div className="flex space-x-32">
        {selectedMovie && (
          <div className="flex flex-col gap-12 w-96 h-full relative group">
            <div className="relative">
              <img
                src={selectedMovie.Poster}
                alt="Selected Movie Poster"
                className="rounded-lg w-96"
              />
              <div className="absolute inset-0 bg-neutral-800 bg-opacity-75 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {selectedMovie.Overview}
              </div>
            </div>
          </div>
        )}
        {movies.map((movie, index) => (
          <div key={movie.imdbID} className="flex flex-col gap-12 w-96 h-full relative group">
            <div className="relative">
              <img
                src={movie.Poster}
                alt="Movie Poster"
                className="rounded-lg w-96"
              />
              <div className="absolute inset-0 bg-neutral-800 bg-opacity-75 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {movie.Overview}
              </div>
            </div>
            <div>
              <Button variant={'default'} onClick={() => handlePick(movie)}>
                Pick
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
