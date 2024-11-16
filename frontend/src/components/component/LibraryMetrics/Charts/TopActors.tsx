import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { omdb } from '@/data/types'
import React, { useEffect, useState } from 'react'

const MWAPI = process.env.NEXT_PUBLIC_MWAPI;
const TMDB = process.env.NEXT_PUBLIC_TMDB!;
const TMDBKEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;

const searchActor = async (name: string) => {
  if (name === "Charles Chaplin") {
    name = "Charlie Chaplin";
  }
  const response = await fetch(`${TMDB}/search/person?query=${encodeURIComponent(name)}&api_key=${TMDBKEY}`);
  const data = await response.json();
  return data.results[0];
};

const getActorImage = async (poster_path: string) => {
  const imageUrl = `${TMDBIMAGEURL}${poster_path}`;
  return imageUrl;
};

const TopActors = ({library}:{library?:omdb[]}) => {
  const [actorData, setActorData] = useState<{actor: string, count: number, movies: omdb[], imageUrl: string | null}[]>([]);

  useEffect(() => {
    const getActorData = async () => {
      const actorCounts = library?.reduce((acc, movie) => {
        movie.Actors.split(', ').forEach(actor => {
          acc[actor] = (acc[actor] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topActors = Object.entries(actorCounts ?? {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      const actorsWithMovies = await Promise.all(
        topActors.map(async ([actor, count]) => {
          const response = await fetch(`${MWAPI}/search/movies/?cast=${encodeURIComponent(actor)}`);
          const movies = await response.json();
          const tmdbActor = await searchActor(actor);
          const imageUrl = tmdbActor?.profile_path ? await getActorImage(tmdbActor.profile_path) : null;
          console.log(tmdbActor);
          return {
            actor,
            count,
            movies,
            imageUrl
          };
        })
      );

      setActorData(actorsWithMovies);
    };

    if (library?.length) {
      getActorData();
    }
  }, [library]);

  console.log(actorData);

  return (
    <Card className="flex flex-col bg-neutral-900 w-full h-1/2 shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Actors</CardTitle>
        <CardDescription className="text-xs">Most movies in library</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-between items-center px-12 pb-4">
        {actorData.map(({actor, count, movies, imageUrl}) => ( 
          <div key={actor} className="flex items-center gap-3 flex-col">
            {imageUrl && <img src={imageUrl} alt={actor} className="w-20 h-20 rounded-full shadow-lg object-cover" />}
            <span className="text-sm font-semibold text-center whitespace-normal">{count} movies<br/>{actor}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopActors