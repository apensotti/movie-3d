"use client"

import { Input } from '@/components/ui/input2'
import React, { useEffect, useState, useRef } from 'react'
import { omdb } from '@/data/types'

const MWAPI = process.env.NEXT_PUBLIC_MWAPI
const OMDBAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL
const OMDBKEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('')
    const [movies, setMovies] = useState<omdb[]>([])
    const [showResults, setShowResults] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const resultsRef = useRef<HTMLDivElement>(null)

    const getMovieData = async (ids: string[]) => {
        const moviePromises = ids.map(async (id) => {
          const response = await fetch(`${OMDBAPI}?i=${id}&plot=full&apikey=${OMDBKEY}`);
          return response.json();
        });
        const movieData = await Promise.all(moviePromises);
        return movieData;
      };

    useEffect(() => {
        const fetchData = async () => {
            if (inputValue.trim() === '') {
                setShowResults(false)
                setMovies([])
                return;
            }
            
            const query = await fetch(`${MWAPI}/search/movies/?title=${encodeURIComponent(inputValue)}`)
            const ids = await query.json();
            const movies = await getMovieData(ids)
            setMovies(movies)
            setShowResults(movies.length > 0)
        }
        fetchData();
    }, [inputValue])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                resultsRef.current && 
                !resultsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-110 z-50">
            <Input 
                ref={inputRef}
                placeholder='Search Movies' 
                className='rounded-full h-9 w-full' 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            {showResults && (
                <div ref={resultsRef} className="absolute w-full mt-1 bg-neutral-900 rounded-md border border-neutral-800 shadow-lg ">
                    <ul className="max-h-[450px] overflow-y-auto no-scrollbar">
                        {movies.map((movie, index) => (
                            <div 
                                key={index} 
                                className="p-2 hover:bg-neutral-800 cursor-pointer flex flex-row items-center gap-2"
                                onClick={() => {
                                    // Handle click event
                                    setShowResults(false)
                                }}
                            >
                                <img src={movie.Poster} width={'13%'} height={'100%'}></img>
                                <div className='flex flex-row gap-2 items-center'>
                                    <div className={`font-bold ${movie.Title.length > 20 ? 'text-md' : 'text-lg'}`}>{movie.Title}</div>
                                    <div className='text-xs'>{movie.Rated === 'Not Rated' ? 'N/A' : movie.Rated}</div>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default SearchBar