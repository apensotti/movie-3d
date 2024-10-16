import React from 'react'
import Link from 'next/link'
import { SiRottentomatoes } from "react-icons/si";
import { omdb } from '../../data/types';

interface MovieCardMdProps {
    movie: omdb;
    }

function MovieCardMd({movie}: MovieCardMdProps) {
  return (
    <Link href={`/movies/${movie.imdbID}`} key={movie.imdbID}>
        <div className='flex items-center justify-between pb-5 pt-5 gap-5 shadow-lg px-2 hover:bg-violet-900 hover:rounded-2xl'>
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
    </Link>
  )
}

export default MovieCardMd