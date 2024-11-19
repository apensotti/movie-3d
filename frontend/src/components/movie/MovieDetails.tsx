"use client";

import { useState } from 'react';
import { omdb } from '../../data/types';
import { MovieVideosProps, Video } from './MovieVideos';
import { SiImdb } from "react-icons/si";
import { SiRottentomatoes } from "react-icons/si";
import { FaHatWizard } from "react-icons/fa6";
import PosterButtons from '../component/PosterButtons';

interface MovieDetailsProps {
  data: omdb;
  poster: string;
  videos: MovieVideosProps;
  onLibraryClick: () => void;
  onWatchlistClick: () => void;
  inLibrary: boolean;
  inWatchlist: boolean;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({data, poster, videos, onLibraryClick, onWatchlistClick, inLibrary, inWatchlist}) => {
  const [showFullPlot, setShowFullPlot] = useState(false);

  const togglePlot = () => {
    setShowFullPlot(!showFullPlot);
  };

  const trailer = videos.results.find((video: Video) => video.name.toLowerCase().includes('trailer'));
  

  return (
    <div className='ml-72 '>

      {/* Title and Year etc*/}
      <div className='flex-col'>
        <h1 className="text-white font-extrabold text-5xl">{data.Title}</h1>
        <div className="flex space-x-1 items-center text-sm pt-1 pb-1 pl-1 text-neutral-400">
          <span>{data.Year}</span>
          <span>&bull;</span>
          <span>{data.Rated}</span>
          <span>&bull;</span>
          <span>{data.Runtime}</span>
        </div>
      </div>

      {/* Movie Poster and Trailer */}
      <div className="flex gap-4">
        <PosterButtons 
          posterLink={poster} 
          onLibraryClick={onLibraryClick} 
          onWatchlistClick={onWatchlistClick} 
          inLibrary={inLibrary}
          inWatchlist={inWatchlist}
          height={450}
          width={300}
        />
        <div className=''>
          {trailer ? (
            <iframe
              width="700"
              height="425"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="flex justify-end rounded-lg"
            ></iframe>
          ) : (
            <div></div>
          )}
        </div>

      {/* Movie Details */}
      <div className="flex-col translate-y-20">

        <div className='pt-2 pl-2 flex gap-6 translate-x-0 -translate-y-8'>
          <div className="flex space-x-1 gap-6 items-center text-sm pt-1 pb-1 pl-1 text-neutral-400">
            {(data.imdbRating) &&
            (<div className='flex gap-2'>
              <SiImdb className='text-yellow-400 text-3xl' />
              <span className='text-3xl'>{data.imdbRating}/10</span>
            </div>)
            }
            { (data.Ratings[1]) &&
            <div className='flex gap-2'> 
              <SiRottentomatoes className='text-red-500 text-3xl' />
              <span className='text-3xl'>{data.Ratings[1].Value}</span>
            </div>
            }
            {(data.Metascore) &&
            <div className='flex gap-2'>
              <FaHatWizard className='text-blue-400 text-3xl' />
              <span className='text-3xl'>{data.Metascore}</span>
            </div>
            }
          </div>
        </div>

        <div className="pt-2 pl-2">
            <h2 className="font-extrabold">Plot</h2>
          <p className="text-xs text-wrap w-96 text-neutral-200">
            {showFullPlot ? data.Plot : `${data.Plot.substring(0, 100)}...`}
          </p>
          <button onClick={togglePlot} className="text-xs text-neutral-400 hover:text-neutral-300">
            {showFullPlot ? 'See Less' : 'See More'}
          </button>
        </div>
        <div className='pt-2 pl-2 flex gap-4'>
            <p className='font-extrabold'>Genre</p>
            <p className='font-medium'>{data.Genre}</p>
        </div>
        <div className='pt-2 pl-2 flex gap-4'>
            <p className='font-extrabold'>Director</p>
            <p className='font-medium'>{data.Director}</p>
        </div>        
        <div className='pt-2 pl-2 flex gap-4'>
            <p className='font-extrabold'>Actors</p>
            <p className='font-medium'>{data.Actors}</p>
        </div>        
        <div className='pt-2 pl-2 flex gap-4'>
            <p className='font-extrabold'>Awards</p>
            <p className='font-medium'>{data.Awards}</p>
        </div>

        
      </div>
      
    </div>
    </div>
  );
};

export default MovieDetails;
