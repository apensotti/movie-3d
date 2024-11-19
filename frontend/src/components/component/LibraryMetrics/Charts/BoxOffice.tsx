import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ResponsiveContainer } from 'recharts'
import { omdb } from '@/data/types'
import React from 'react'
import { ChartContainer } from '@/components/ui/chart'

const BoxOffice = ({library}:{library?:omdb[]}) => {
    const totalBudget = library?.reduce((acc, movie) => {
        if (!movie.BoxOffice || movie.BoxOffice === 'N/A') return acc;
        const boxOffice = movie.BoxOffice.replace(/[$,]/g, '');
        const amount = parseFloat(boxOffice) || 0;
        return acc + amount;
    }, 0);

  return (
    <Card className="flex flex-col bg-neutral-900 w-full h-full shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Budget</CardTitle>
        <CardDescription className="text-xs">Library Total Budget</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center pb-8">
        <div className="text-4xl text-green-700 pr-2">$</div>
        <div className="text-4xl">{totalBudget?.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}

export default BoxOffice