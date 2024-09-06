import * as React from "react"
import { HiArrowCircleUp } from 'react-icons/hi';
import { Button } from "./button";

import { cn } from "@/lib/utils"
import { BsArrowUpCircleFill } from "react-icons/bs";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex justify-between gap-1">
        <div className="w-full align-middle">
          <input
            type={type}
            className={cn(
              "flex h-8 w-full rounded-md border-input bg-neutral-800 px-3 py-1 text-2xs text-neutral-50 shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium placeholder:text-neutral-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>    
        <BsArrowUpCircleFill className="text-3xl hover:opacity-80 translate-y-0.5 text-neutral-600" />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
