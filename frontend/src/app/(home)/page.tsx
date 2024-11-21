import DailyMovieCard from '@/components/Home/DailyMovieCard';
import MovieScrollX from '@/components/Home/MovieScrollX';
import PopularMoviesByWrapper from '@/components/Home/PopularMoviesByWrapper';
import { tmdb } from '@/data/types';
import React from 'react';

async function getDailyMovie() {
  const MWAPI = process.env.NEXT_PUBLIC_MWAPI;
  const OMDB_URL = process.env.NEXT_PUBLIC_OMDBAPI_URL;
  const OMDB_KEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY;
  
  try {
    const response = await fetch(`${MWAPI}/data/get_daily_movie/`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!response.ok) throw new Error('Failed to fetch daily movie');
    const data = await response.json();
    
    const omdbResponse = await fetch(`${OMDB_URL}?i=${data}&apikey=${OMDB_KEY}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    return omdbResponse.json();
  } catch (error) {
    console.error('Error fetching daily movie:', error);
    return null;
  }
}

async function getRecentReleases() {
  const TMDB_URL = process.env.NEXT_PUBLIC_TMDB;
  const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const twoWeeksAgo = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0];

  console.log(twoWeeksAgo, today);
  
  const response = await fetch(`${TMDB_URL}/discover/movie?include_adult=false&with_original_language=en&include_video=false&language=en-US&page=1&vote_count.gte=50&release_date.gte=${twoWeeksAgo}&release_date.lte=${today}&sort_by=popularity.desc`, options);
  const data = await response.json();
  const results = data.results;
  const imdb = results.map((result: tmdb) => fetch(`${TMDB_URL}/movie/${result.id}/external_ids`, options));
  const imdbResponses = await Promise.all(imdb);
  const imdbData = await Promise.all(imdbResponses.map(r => r.json()));
  
  const resultsWithImdb = results.map((movie: tmdb, index: number) => ({
    ...movie,
    imdb_id: imdbData[index].imdb_id
  }));

  return resultsWithImdb;
}

async function getPopularMovies() {
  const TMDB_URL = process.env.NEXT_PUBLIC_TMDB;
  const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  };

  const response = await fetch(`${TMDB_URL}/movie/top_rated?language=en-US&page=1`, options);
  const data = await response.json();
  return data.results;
}

export default async function HomePage() {
  const dailyMovie = await getDailyMovie();
  const recentReleases = await getRecentReleases();
  const popularMovies = await getPopularMovies();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  if (!dailyMovie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load daily movie</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-2xl sm:text-3xl font-bold pt-8 pb-4 sm:pt-12">{today}'s Movie</div>
        <DailyMovieCard movie={dailyMovie} />
        <div className="text-2xl sm:text-3xl font-bold pt-8 pb-4 sm:pt-12">Recent Releases</div>
        <MovieScrollX movies={recentReleases}/>
        <div className="text-2xl sm:text-3xl font-bold pt-8 pb-4 sm:pt-12">Popular Movies</div>
        <PopularMoviesByWrapper initialMovies={popularMovies} />
      </div>
    </div>
  );
}
