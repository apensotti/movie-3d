"use client";

import { useRef } from "react";
import MovieDetails from "./MovieDetails";
import MovieVideos, { MovieVideosProps } from "./MovieVideos";
import { omdb } from "../../data/types";
import { Video } from "./MovieVideos";

interface PageNavProps {
  ombd_data: omdb;
  poster: string;
  video_data: MovieVideosProps;
}

const PageNav = ({ ombd_data, poster, video_data }: PageNavProps) => {
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
          <MovieDetails data={ombd_data} poster={poster} videos={video_data}/>
        </div>
        <div className="pb-36" ref={section2Ref}>
          <MovieVideos results={video_data.results}/>
        </div>
      </div>
    </div>
  );
};

export default PageNav;
