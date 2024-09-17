import * as React from "react";
import { BsArrowUpCircleFill } from "react-icons/bs";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onArrowClick?: () => void; // Arrow click event handler
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onArrowClick, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "flex h-8 w-full rounded-md bg-neutral-800 px-3 py-1 pr-10 text-2xs text-neutral-50 shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium placeholder:text-neutral-50 focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {/* Icon placed inside the input on the right */}
        <BsArrowUpCircleFill
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-2xl text-neutral-100 hover:text-neutral-700 selection:text-violet-800 cursor-pointer"
          onClick={onArrowClick} // Trigger arrow click event
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
