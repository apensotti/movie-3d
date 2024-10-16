"use client";

import { useRef, useState, useEffect } from "react";
import MovieDetails from "./MovieDetails";
import MovieVideos, { MovieVideosProps } from "./MovieVideos";
import { omdb } from "../../data/types";

interface PageNavProps {
  ombd_data: omdb;
  poster: string;
  video_data: MovieVideosProps;
  userEmail: string | null | undefined;
  imdbID: string;
  mwapiUrl: string;
}

const PageNav = ({ 
  ombd_data, 
  poster, 
  video_data, 
  userEmail, 
  imdbID, 
  mwapiUrl
}: PageNavProps) => {
  const [inLibrary, setInLibrary] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieStatus = async () => {
      if (!userEmail) return;
      try {
        const response = await fetch(`${mwapiUrl}/users/${userEmail}/movie-status/${imdbID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch movie status');
        }
        const data = await response.json();
        setInLibrary(data.inLibrary);
        setInWatchlist(data.inWatchlist);
      } catch (error) {
        console.error("Error fetching movie status:", error);
      }
    };

    fetchMovieStatus();
  }, [userEmail, imdbID, mwapiUrl]);

  const updateDatabase = async (list: 'library' | 'watchlist', action: 'add' | 'remove') => {
    if (!userEmail) return;
    try {
      const response = await fetch(`${mwapiUrl}/users/${userEmail}/${list}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imdbID }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${list}`);
      }
    } catch (error) {
      console.error(`Error updating ${list}:`, error);
      // Revert the state if the update fails
      if (list === 'library') {
        setInLibrary(!inLibrary);
      } else {
        setInWatchlist(!inWatchlist);
      }
    }
  };

  const handleLibraryClick = () => {
    const newInLibrary = !inLibrary;
    setInLibrary(newInLibrary);
    if (newInLibrary && inWatchlist) {
      setInWatchlist(false);
    }
    updateDatabase('library', newInLibrary ? 'add' : 'remove');
  };

  const handleWatchlistClick = () => {
    const newInWatchlist = !inWatchlist;
    setInWatchlist(newInWatchlist);
    if (newInWatchlist && inLibrary) {
      setInLibrary(false);
    }
    updateDatabase('watchlist', newInWatchlist ? 'add' : 'remove');
  };

  // Refs for the sections
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);

  // Function to handle scroll to a section
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen">
      {/* Vertical Navigation */}
      <nav className="absolute translate-y-72 w-20 translate-x-3 bg-opacity-0 text-white flex flex-col justify-center items-center space-y-8">
        {/* Vertical line */}
        <div className="absolute h-72 border-l-2 translate-y-4 border-gray-400 left-1/2 transform -translate-x-1/2 z-0"></div>

        {/* Buttons */}
        <button
          onClick={() => scrollToSection(section1Ref)}
          className="relative z-10 p-2 w-12 h-12 bg-neutral-700 hover:bg-neutral-800 rounded-full flex justify-center items-center"
        >
          1
        </button>
        <button
          onClick={() => scrollToSection(section2Ref)}
          className="relative z-10 p-2 w-12 h-12 bg-neutral-700 hover:bg-neutral-800 rounded-full flex justify-center items-center"
        >
          2
        </button>
        <button
          onClick={() => scrollToSection(section3Ref)}
          className="relative z-10 p-2 w-12 h-12 bg-neutral-700 hover:bg-neutral-800 rounded-full flex justify-center items-center"
        >
          3
        </button>
        <button
          onClick={() => scrollToSection(section4Ref)}
          className="relative z-10 p-2 w-12 h-12 bg-neutral-700 hover:bg-neutral-800 rounded-full flex justify-center items-center"
        >
          4
        </button>
      </nav>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-tr from-neutral-950 to-neutral-800 no-scrollbar">
        <div className="pt-36 pb-36" ref={section1Ref}>
          <MovieDetails 
            data={ombd_data} 
            poster={poster} 
            videos={video_data} 
            onLibraryClick={handleLibraryClick}
            onWatchlistClick={handleWatchlistClick}
            inLibrary={inLibrary}
            inWatchlist={inWatchlist}
          />
        </div>
        <div className="pb-36" ref={section2Ref}>
          <MovieVideos results={video_data.results}/>
        </div>
      </div>
    </div>
  );
};

export default PageNav;
