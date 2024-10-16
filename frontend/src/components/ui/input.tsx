import * as React from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { cn } from "../../lib/utils";
import { FaSliders } from "react-icons/fa6";
import Filters from "../component/Filters";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onArrowClick?: () => void; // Arrow click event handler
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onArrowClick, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <div className="relative flex-grow">
          <input
            type={type}
            className={cn(
              "flex h-8 w-full rounded-md bg-neutral-850 px-3 py-1 pr-10 text-2xs text-neutral-50 shadow-md transition-colors file:border-0 file:bg-white file:text-sm file:font-medium placeholder:text-neutral-50 focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <BsArrowUpCircleFill
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-xl text-neutral-100 hover:text-neutral-700 selection:text-violet-800 cursor-pointer"
            onClick={onArrowClick}
          />
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
