import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { omdb } from '@/data/types'
import React, { useEffect, useState } from 'react'

const MWAPI = process.env.NEXT_PUBLIC_MWAPI;
const TMDB = process.env.NEXT_PUBLIC_TMDB!;
const TMDBKEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;

const searchDirector = async (name: string) => {
  if (name === "Charles Chaplin") {
    name = "Charlie Chaplin";
  }
  const response = await fetch(`${TMDB}/search/person?query=${encodeURIComponent(name)}&api_key=${TMDBKEY}`);
  const data = await response.json();
  return data.results[0];
};

const getDirectorImage = async (poster_path: string) => {
  const imageUrl = `${TMDBIMAGEURL}${poster_path}`;
  return imageUrl;
};

const TopDirectors = ({library}:{library?:omdb[]}) => {
  const [directorData, setDirectorData] = useState<{director: string, count: number, movies: omdb[], imageUrl: string | null}[]>([]);

  useEffect(() => {
    const getDirectorData = async () => {
      const directorCounts = library?.reduce((acc, movie) => {
        movie.Director.split(', ').forEach(director => {
          acc[director] = (acc[director] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topDirectors = Object.entries(directorCounts ?? {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      const directorsWithMovies = await Promise.all(
        topDirectors.map(async ([director, count]) => {
          const response = await fetch(`${MWAPI}/search/movies/?director=${encodeURIComponent(director)}`);
          const movies = await response.json();
          const tmdbDirector = await searchDirector(director);
          const imageUrl = tmdbDirector?.profile_path ? await getDirectorImage(tmdbDirector.profile_path) : null;
          return {
            director,
            count,
            movies,
            imageUrl
          };
        })
      );

      setDirectorData(directorsWithMovies);
    };

    if (library?.length) {
      getDirectorData();
    }
  }, [library]);

  return (
    <Card className="flex flex-col bg-neutral-900 w-full h-1/2 shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Directors</CardTitle>
        <CardDescription className="text-xs">Most movies in library</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-between items-center px-12 pb-4">
        {directorData.map(({director, count, movies, imageUrl}) => (
          <div key={director} className="flex items-center gap-3 flex-col">
            {imageUrl && <img src={imageUrl} alt={director} className="w-20 h-20 rounded-full shadow-lg object-cover" />}
            <span className="text-sm font-semibold text-center whitespace-normal">{count} movies<br/>{director}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopDirectors