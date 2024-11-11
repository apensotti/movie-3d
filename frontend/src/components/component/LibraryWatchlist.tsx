'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import PosterButtons from './PosterButtons';
import { IoLibrary } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { getRecommendations } from '@/hooks/searchHooks';
import { omdb } from '@/data/types';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY;

export default function LibraryWatchlist() {
    const [activeTab, setActiveTab] = useState('library');
    const [libraryMovies, setLibraryMovies] = useState<string[]>([]);
    const [watchlistMovies, setWatchlistMovies] = useState<string[]>([]);
    const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});
    const [recommendationMovies, setRecommendationMovies] = useState<omdb[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [showRecommendations, setShowRecommendations] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchMovies = async () => {
            const userEmail = session?.user?.email;
            if (!userEmail) return;

            try {
                setIsLoading(true);
                const libraryResponse = await fetch(`${MWAPI}/users/${userEmail}/library`);
                const watchlistResponse = await fetch(`${MWAPI}/users/${userEmail}/watchlist`);
                
                
                if (!libraryResponse.ok) throw new Error('Failed to fetch library');
                if (!watchlistResponse.ok) throw new Error('Failed to fetch watchlist');

                const libraryData = await libraryResponse.json();
                const watchlistData = await watchlistResponse.json();
                
                setLibraryMovies(libraryData);
                setWatchlistMovies(watchlistData);
                
                const allMovies = [...libraryData, ...watchlistData];
                const posterPromises = allMovies.map(imdbID =>
                    fetch(`${OMBDAPI}?i=${imdbID}&apikey=${OMDB_API_KEY}`)
                        .then(res => res.json())
                        .then(data => ({ [imdbID]: data.Poster }))
                );

                const posters = await Promise.all(posterPromises);
                setMoviePosters(Object.assign({}, ...posters));
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        const fetchRecs = async () => {
            setIsLoading(true);
            const userEmail = session?.user?.email;
            if (!userEmail) return;

            const recommendations = await fetch(`${MWAPI}/search/recommendations/?email=${userEmail}&library_bool=${true}&exclusive=${true}`)
            
            if (!recommendations.ok) throw new Error('Failed to fetch recommendations');

            const recommendationData = await recommendations.json();

            const rec_movies = await Promise.all(recommendationData.map(async (id:string) => {
                const response = await fetch(`${OMBDAPI}?i=${id}&apikey=${OMDB_API_KEY}`)
                return response.json()
            }))

            setRecommendationMovies(rec_movies);
        }
        fetchRecs();
    }, [])

    const handleLibraryClick = async (imdbID: string) => {
        const userEmail = session?.user?.email;
        if (!userEmail) return;

        const action = libraryMovies.includes(imdbID) ? 'remove' : 'add';
        try {
            const response = await fetch(`${MWAPI}/users/${userEmail}/library/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imdbID }),
            });
            if (!response.ok) throw new Error('Failed to update library');
            
            setLibraryMovies(prev => 
                action === 'add' ? [...prev, imdbID] : prev.filter(id => id !== imdbID)
            );
            if (action === 'add') {
                setWatchlistMovies(prev => prev.filter(id => id !== imdbID));
            }
        } catch (error) {
            console.error("Error updating library:", error);
        }
    };

    const handleWatchlistClick = async (imdbID: string) => {
        const userEmail = session?.user?.email;
        if (!userEmail) return;

        const action = watchlistMovies.includes(imdbID) ? 'remove' : 'add';
        try {
            const response = await fetch(`${MWAPI}/users/${userEmail}/watchlist/${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imdbID }),
            });
            if (!response.ok) throw new Error('Failed to update watchlist');
            
            setWatchlistMovies(prev => 
                action === 'add' ? [...prev, imdbID] : prev.filter(id => id !== imdbID)
            );
            if (action === 'add') {
                setLibraryMovies(prev => prev.filter(id => id !== imdbID));
            }
        } catch (error) {
            console.error("Error updating watchlist:", error);
        }
    };
 
    return (
        <div className="h-full flex flex-col p-0">   
            <div className='bg-neutral-850 flex flex-col p-4 shadow-lg overflow-hidden relative h-full gap-4'>
                <div className="flex flex-row bg-neutral-900 rounded-full mx-44 mr-52 p-2">
                    
                </div>  
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    </div>
                ) : (
                    <div className="overflow-y-auto no-scrollbar px-48 ">
                        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-16">
                            {(activeTab === 'library' ? libraryMovies : watchlistMovies).map(imdbID => (
                                <div key={imdbID} className="w-full pb-[130%] relative">
                                    {moviePosters[imdbID] && (
                                        <div className="absolute">
                                            <PosterButtons
                                                width={"80%"}
                                                height={"80%"}
                                                posterLink={moviePosters[imdbID]}
                                                onLibraryClick={() => handleLibraryClick(imdbID)}
                                                onWatchlistClick={() => handleWatchlistClick(imdbID)}
                                                inLibrary={libraryMovies.includes(imdbID)}
                                                inWatchlist={watchlistMovies.includes(imdbID)}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>
            {/* <div>
            {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    </div>
                ) : (
                <div className="flex overflow-x-auto gap-2 p-4 ">
                    {recommendationMovies.map(movie => (
                        <PosterButtons
                            width={"5%"}
                            height={"5%"}
                            posterLink={movie.Poster}
                            onLibraryClick={() => handleLibraryClick(movie.imdbID)}
                            onWatchlistClick={() => handleWatchlistClick(movie.imdbID)}
                            inLibrary={libraryMovies.includes(movie.imdbID)}
                            inWatchlist={watchlistMovies.includes(movie.imdbID)}
                        />
                    ))}
                </div>
                )}
            </div> */}
        </div>
    );
}





{/* <div className="flex relative flex-shrink-0">
                <button
                    className={`flex-1 py-2 px-4 text-center rounded-t-xl flex items-center justify-center ${activeTab === 'library' ? 'bg-violet-800 text-white z-10' : 'bg-neutral-850'} shadow-lg relative`}
                    onClick={() => setActiveTab('library')}
                    style={{
                        clipPath: 'inset(-5px -5px 0px -5px)',
                        marginRight: '-10px'
                    }}
                >
                    <IoLibrary className="mr-2" />
                    Library
                </button>
                <button
                    className={`flex-1 py-2 px-4 text-center rounded-t-xl flex items-center justify-center ${activeTab === 'watchlist' ? 'bg-violet-800 text-white z-10' : 'bg-neutral-850'} shadow-lg relative`}
                    onClick={() => setActiveTab('watchlist')}
                    style={{
                        clipPath: 'inset(-5px -5px 0px -5px)',
                        marginLeft: '-10px'
                    }}
                >
                    <FaStar className="mr-2" />
                    Watchlist
                </button>
            </div> */}