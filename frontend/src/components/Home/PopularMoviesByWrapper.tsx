"use client"

import { tmdb } from '@/data/types';
import { useState } from 'react';
import PopularMoviesBy from './PopularMoviesBy';

async function getPopularMoviesByYear(year: number) {
  const TMDB_URL = process.env.NEXT_PUBLIC_TMDB;
  const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  };

  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  const response = await fetch(
    `${TMDB_URL}/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=popularity.desc`,
    options
  );
  const data = await response.json();
  return data.results;
}

const PopularMoviesByWrapper = ({ initialMovies }: { initialMovies: tmdb[] }) => {
  const [movies, setMovies] = useState(initialMovies);

  const handleYearChange = async (year: number) => {
    const moviesByYear = await getPopularMoviesByYear(year);
    setMovies(moviesByYear);
  };

  return <PopularMoviesBy movies={movies} onYearChange={handleYearChange} />;
};

export default PopularMoviesByWrapper;