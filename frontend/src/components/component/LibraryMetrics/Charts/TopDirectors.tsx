import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { omdb } from '@/data/types'
import React from 'react'

const TopDirectors = ({library}:{library?:omdb[]}) => {
  const directorCounts = library?.reduce((acc, movie) => {
    movie.Director.split(', ').forEach(director => {
      acc[director] = (acc[director] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topDirectors = Object.entries(directorCounts ?? {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([director, count]) => ({
      director,
      count
    }));

  return (
    <Card className="flex flex-col bg-neutral-900 w-full h-1/2 shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top Directors</CardTitle>
        <CardDescription className="text-xs">Most movies in library</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center pb-0 pt-">
        {topDirectors.map(({director, count}) => (
          <div key={director}>
            {director}: {count}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default TopDirectors