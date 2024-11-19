"use client"
import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { omdb } from "@/data/types"
import { ResponsiveContainer } from "recharts"

const chartConfig = {
  library: {
    label: "Library",
    color: "#8b5cf6",
  },
  watchlist: {
    label: "Watchlist", 
    color: "#f97316",
  },
} satisfies ChartConfig

export function TotalMovies({library, watchlist}:{library?:omdb[], watchlist?:omdb[]}) {
  const totalMovies = (library?.length || 0) + (watchlist?.length || 0)
  const chartData = [{
    library: library?.length || 0,
    watchlist: watchlist?.length || 0
  }]

  return (
    <Card className="flex flex-col bg-neutral-900 w-full h-full shadow-md">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Movies</CardTitle>
        <CardDescription className="text-xs">Library/Watchlist</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center items-center pb-0 pt-">
        <ResponsiveContainer width={250} height={250}>
          <ChartContainer
            config={chartConfig}
            className="mx-auto"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius="70%"
              outerRadius="100%"
              cx="50%"
              cy="60%"
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalMovies.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Total Movies
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="library"
                stackId="a"
                cornerRadius={5}
                fill="#8b5cf6"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="watchlist"
                fill="#f97316"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
