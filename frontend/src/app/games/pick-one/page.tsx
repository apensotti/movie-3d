'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY;

export default function PickOnePage() {
  const [movies, setMovies] = useState<{ imdbID: string; Poster: string }[]>([]);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const randomImdbIDs = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0050083', 'tt0108052', 'tt0167260', 'tt0110912', 'tt0060196', 'tt0120737'];
        const shuffled = randomImdbIDs.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 2);

        const moviePromises = selected.map(imdbID =>
          fetch(`${OMBDAPI}?i=${imdbID}&apikey=${OMDB_API_KEY}`)
            .then(res => res.json())
            .then(data => ({ imdbID: data.imdbID, Poster: data.Poster }))
        );

        const movieData = await Promise.all(moviePromises);
        setMovies(movieData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchRandomMovies();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-neutral-900">
      <div className="flex space-x-8">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="w-64 h-96 relative">
            <img
              src={movie.Poster}
              alt="Movie Poster"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
