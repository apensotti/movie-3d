"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { omdb } from "@/data/types"
import { ResponsiveContainer } from "recharts"

const chartConfig = {
  rating: {
    label: "Average Rating",
    color: "#f97316",
  },
} satisfies ChartConfig

export function AverageRating({library}:{library?:omdb[]}) {

  const averageRating = library?.length ? (
    library.reduce((acc, movie) => acc + parseFloat(movie.imdbRating || "0"), 0) / library.length
  ).toFixed(1) : "0";

  const chartData = [{
    rating: averageRating,
    fill: "#f97316"
  }];

  // Calculate angles based on rating percentage
  const ratingPercentage = parseFloat(averageRating) * 10; // Convert rating to percentage (e.g. 7.0 -> 70%)
  const totalAngle = 360; // Total angle for the circle
  const angleToFill = (totalAngle * ratingPercentage) / 100;
  const startAngle = 270;
  const endAngle = startAngle - angleToFill;
  
  return (
    <Card className="flex flex-col bg-neutral-900 w-full h-full shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm">Average Rating</CardTitle>
        <CardDescription className="text-xs">IMDb Rating</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex justify-center items-center">
        <ResponsiveContainer width={200} height={200}>
          <ChartContainer
            config={chartConfig}
            className="mx-auto h-full w-full"
          >
            <RadialBarChart
              data={chartData}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius="73%"
              outerRadius="100%"
              cx="50%"
              cy="50%"
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="none"
                className="first:fill-muted last:fill-neutral-900"
                polarRadius={[69, 59]}
              />
              <RadialBar dataKey="rating" background cornerRadius={10} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 8}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {chartData[0].rating}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 16}
                            className="fill-muted-foreground text-xs"
                          >
                            Average Rating
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
