import { omdb } from '@/data/types'
import React from 'react'
import { SiRottentomatoes } from "react-icons/si";
import Draggable from 'react-draggable';
interface MoviesProps {
    movies: omdb[]
}

const Movies = ({ movies }: MoviesProps) => {

    return (
        <Draggable>
        <div className='w-96 h-96 bg-neutral-800 rounded-2xl overflow-hidden overflow-y-scroll no-scrollbar '>
            {movies.map((movie) => {
                return (
                    <div key={movie.imdbID} className='flex items-center justify-between pb-5 pt-5 gap-5 shadow-lg px-2 hover:bg-neutral-900'>
                        <div className='flex flex-row gap-2'>
                            <img src={movie.Poster} alt={movie.Title} width={50} height={50} className='pl-2'/>
                            <div className='flex flex-col'>
                                <div className='flex flex-row gap-2'>
                                    <h1 className='text-white font-semibold'>{movie.Title}</h1>
                                    <h1 className='text-white font-regular pt-1 text-3xs'>{movie.Rated}</h1>
                                </div>
                                <h2 className='text-white font-thin text-2xs'>{movie.Year}</h2>
                                <div className=''>
                                    <h2 className='text-white font-thin text-2xs line-clamp-2'>{movie.Plot}</h2>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-row gap-1 pr-2'>
                            <SiRottentomatoes className='text-red-500 text-sm' />
                            <h2 className='text-white font-bold text-2xs -translate-y-[2px]'>{movie.Ratings[1]?.Value || 'N/A'}</h2>
                        </div>
                    </div>
                )
            })}
        </div>
        </Draggable>
    )
}

export default Movies
