import * as React from "react";
import { FaArrowUp } from "react-icons/fa";
import { cn } from "../../lib/utils";
import { FaSliders } from "react-icons/fa6";
import Filters from "../component/Filters";
import { TbPlayerStopFilled } from "react-icons/tb";
import { Button } from "./button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onArrowClick?: () => void; // Arrow click event handler
  isLoading?: boolean;
  stop?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onArrowClick, isLoading, stop, ...props }, ref) => {
    return (
      <div className="flex items-center scale-150">
        <div className="relative flex-grow">
          <input
            type={type}
            className={cn(
              "flex h-8 w-full rounded-md bg-neutral-850 px-3 py-1 pr-10 text-xs text-neutral-50 shadow-md transition-colors file:border-0 file:bg-white file:text-sm file:font-medium placeholder:text-neutral-50 focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <button className="absolute right-1 top-1/2 transform bg-neutral-50 rounded-full -translate-y-1/2 hover:bg-violet-800 flex items-center justify-center w-6 h-6">
            {isLoading ? (
              <TbPlayerStopFilled
                onClick={stop}
                className="m-auto w-3 h-3 text-neutral-800"
              />
            ) : (
              <FaArrowUp
                onClick={onArrowClick}
                className="m-auto w-3 h-3 text-neutral-800"
              />
            )}
          </button>
        
        </div>
        <div className="ml-1">
          <Filters />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
