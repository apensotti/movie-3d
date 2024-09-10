import { omdb } from '../data/types'
import React, { useState } from 'react'
import { SiRottentomatoes } from "react-icons/si";
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // Arrow icons for toggling
import Draggable from 'react-draggable';

interface MoviesProps {
    movies: omdb[]
    isVisible: boolean
    setIsVisible: (isVisible: boolean) => void
}

const Movies = ({ movies, isVisible, setIsVisible }: MoviesProps) => {
    
    // Function to toggle visibility
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className=' ml-10'>
            {/* Movies component container */}
            <div
                className={`absolute bottom-5 left-1/2 transform -translate-x-48 w-96 h-96 bg-neutral-800 rounded-2xl no-scrollbar transition-transform duration-400 ease-in-out ${
                    isVisible ? '-translate-y-0' : 'translate-y-full'
                }`}
            >
                {/* Button to toggle visibility */}
                <button 
                    onClick={toggleVisibility} 
                    className="absolute top-0 left-1/2 transform translate-x-32 -translate-y-5 z-10  text-white p-2 rounded-full"
                >
                    {isVisible ? <FiChevronDown size={24} className='-translate-y-3'/> : <FiChevronUp size={24} className='-translate-y-3'/>}
                </button>
                <div className='overflow-y-scroll w-full h-full no-scrollbar z-30'>
                    {isVisible && movies.map((movie) => {
                        return (
                            <div key={movie.imdbID} className='flex items-center justify-between pb-5 pt-5 gap-5 shadow-lg px-2 hover:bg-neutral-900 hover:rounded-2xl z-50'>
                                <div className='flex flex-row gap-2'>
                                    <img src={movie.Poster} alt={movie.Title} width={50} height={50} className='pl-2'/>
                                    <div className='flex flex-col'>
                                        <div className='flex flex-row gap-2'>
                                            <h1 className='text-white font-semibold'>{movie.Title}</h1>
                                            <h1 className='text-white font-regular pt-1 text-3xs'>{movie.Rated || ' - '}</h1>
                                        </div>
                                        <h2 className='text-white font-thin text-2xs'>{movie.Year}</h2>
                                        <div className=''>
                                            <h2 className='text-white font-thin text-2xs line-clamp-2'>{movie.Plot}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-row gap-1 pr-2'>
                                    <SiRottentomatoes className='text-red-500 text-sm' />
                                    <h2 className='text-white font-bold text-2xs -translate-y-[2px]'>{movie.Ratings[1]?.Value || ' - '}</h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Movies;
