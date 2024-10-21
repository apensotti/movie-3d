import React, { useState } from 'react';
import Image from 'next/image';
import LibraryWatchlistAddButtons from './LibraryWatchlistAddButtons';

interface PosterButtonsProps {
  posterLink: string;
  onLibraryClick: () => void;
  onWatchlistClick: () => void;
  inLibrary: boolean;
  inWatchlist: boolean;
  width?: number | string;
  height?: number | string;
}

const PosterButtons: React.FC<PosterButtonsProps> = ({ 
  posterLink, 
  onLibraryClick, 
  onWatchlistClick, 
  inLibrary,
  inWatchlist,
  width = '100%',
  height = '100%'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative"
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={posterLink}
        alt="Movie Poster"
        className="w-full h-full object-cover rounded-lg"
      />
      {isHovered && (
        <div className="absolute inset-0 bg-neutral-800 bg-opacity-75 flex items-center justify-center rounded-lg transition-opacity duration-300">
          <LibraryWatchlistAddButtons
            onLibraryClick={onLibraryClick}
            onWatchlistClick={onWatchlistClick}
            inLibrary={inLibrary}
            inWatchlist={inWatchlist}
          />
        </div>
      )}
    </div>
  );
};

export default PosterButtons;
