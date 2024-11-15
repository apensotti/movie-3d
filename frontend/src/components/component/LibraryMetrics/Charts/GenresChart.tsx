import React from 'react'

import { Bar, BarChart, YAxis, XAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { omdb } from '@/data/types';

const chartConfig = {
  count: {
    label: "Movie Count",
  },
  genre: {
    label: "Genres",
    color: "#6d28d9",
  }
} satisfies ChartConfig

const GenresChart = ({movies}:{movies?:omdb[]}) => {
    const genreCounts = movies?.reduce((acc, movie) => {
        movie.Genre.split(', ').forEach(genre => {
            acc[genre] = (acc[genre] || 0) + 1;
       });
       return acc;
     }, {} as Record<string, number>);

    const chartData = Object.entries(genreCounts ?? {})
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className=" bg-neutral-900 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight">Genres</h3>
            <p className="text-sm text-muted-foreground">
              Distribution of movie genres in your library
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 10
                }}
              >
                <YAxis
                  dataKey="genre"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                />
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  fontSize={12}
                />
                <ChartTooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6" // Light violet
                  radius={[4, 4, 4, 4]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default GenresChart