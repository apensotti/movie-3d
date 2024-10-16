import React from 'react';
import { IoLibrary } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface LibraryWatchlistAddButtonsProps {
  onLibraryClick: () => void;
  onWatchlistClick: () => void;
  inLibrary: boolean;
  inWatchlist: boolean;
}

const LibraryWatchlistAddButtons: React.FC<LibraryWatchlistAddButtonsProps> = ({ 
  onLibraryClick, 
  onWatchlistClick, 
  inLibrary, 
  inWatchlist 
}) => {
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLibraryClick}
              className={`rounded-full p-1.5 w-8 h-8 flex items-center justify-center ${
                inLibrary ? 'bg-neutral-800' : 'bg-neutral-800 hover:bg-violet-600'
              }`}
            >
              <IoLibrary className={`text-base ${inLibrary ? 'text-yellow-400' : 'text-white'} hover:text-yellow-400`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{inLibrary ? 'Remove from Library' : 'Add to Library'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onWatchlistClick}
              className={`rounded-full p-1.5 w-8 h-8 flex items-center justify-center ${
                inWatchlist ? 'bg-neutral-800' : 'bg-neutral-800 hover:bg-violet-600'
              }`}
            >
              <FaStar className={`text-base ${inWatchlist ? 'text-yellow-400' : 'text-white'} hover:text-yellow-400`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default LibraryWatchlistAddButtons;
