import * as React from "react";
import { FaArrowUp } from "react-icons/fa";
import { cn } from "../../lib/utils";
import { FaSliders } from "react-icons/fa6";
import Filters from "../component/Filters";
import { TbPlayerStopFilled } from "react-icons/tb";
import { Button } from "./button";
import { FaSearch } from "react-icons/fa";
import { Switch } from "./switch";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onArrowClick?: () => void; // Arrow click event handler
  isLoading?: boolean;
  stop?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onArrowClick, isLoading, stop, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <div className="relative flex-grow">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
            <FaSearch className="mr-1"/>
          </div>
          <input
            type={type}
            className={cn(
              "flex h-8 w-full rounded-md bg-neutral-850 pl-10 pr-10 py-1 text-xs text-neutral-50 shadow-md transition-colors file:border-0 file:bg-white file:text-sm file:font-medium placeholder:text-neutral-50 focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
            <Switch className=""/> 
          </div>           */}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
