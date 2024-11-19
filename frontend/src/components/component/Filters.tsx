import React from 'react'
import { FaSliders } from "react-icons/fa6";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from './../ui/label';
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

const Filters = () => {
  const [popularityRange, setPopularityRange] = React.useState([1, 10])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-neutral-50 hover:bg-violet-600">
          <FaSliders className="h-3 w-3 text-neutral-800 hover:text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 bg-neutral-800 border-none origin-top-left transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 pb-4" align="start">
        <div className="grid gap-4">
          <h4 className="font-medium leading-none text-neutral-50">Filters</h4>
          <div className="grid gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="popularity" className='text-neutral-50'>
                  Popularity
                </Label>
                <Badge variant="secondary">
                  {popularityRange[0]} - {popularityRange[1]}
                </Badge>
              </div>
              <Slider
                id="popularity"
                min={1}
                max={10}
                step={1}
                value={popularityRange}
                onValueChange={setPopularityRange}
                className=''
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Filters
