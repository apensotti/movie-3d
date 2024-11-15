'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import PosterButtons from './PosterButtons';
import { getRecommendations } from '@/hooks/searchHooks';
import { omdb } from '@/data/types';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label'; 

import { IoLibrary } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import SearchBar from './SearchBar/SearchBar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { IoStatsChart } from "react-icons/io5"
import LibraryMetrics from './LibraryMetrics/LibraryMetrics';

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
    const [isChecked, setIsChecked] = useState(false);

    const [libraryOmdb, setLibraryOmdb] = useState<omdb[]>([]);
    const [watchlistOmdb, setWatchlistOmdb] = useState<omdb[]>([]);    

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
                const moviePromises = allMovies.map(imdbID =>
                    fetch(`${OMBDAPI}?i=${imdbID}&apikey=${OMDB_API_KEY}`)
                        .then(res => res.json())
                );

                const movies = await Promise.all(moviePromises);
                const posters = movies.map(movie => ({ [movie.imdbID]: movie.Poster }));
                setMoviePosters(Object.assign({}, ...posters));
                setLibraryOmdb(movies.filter(movie => libraryData.includes(movie.imdbID)));
                setWatchlistOmdb(movies.filter(movie => watchlistData.includes(movie.imdbID)));
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
            <div className='bg-neutral-850 flex flex-col p-4 shadow-lg overflow-hidden relative h-full gap-0'>
                <div className="flex flex-row items-center justify-between bg-neutral-900 rounded-full mx-44 mr-52 p-2 gap-3">
                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 w-28 rounded-full bg-neutral-800">
                                    {activeTab === 'library' && <img src={'/icons/Library.svg'} className='h-4 w-4'/>}
                                    {activeTab === 'watchlist' && <FaStar className="text-yellow-500" />}
                                    {activeTab === 'metrics' && <IoStatsChart />}
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setActiveTab('library')} className="flex items-center gap-2">
                                    <IoLibrary />
                                    Library
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab('watchlist')} className="flex items-center gap-2">
                                    <FaStar />
                                    Watchlist
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setActiveTab('metrics')} className="flex items-center gap-2">
                                    <IoStatsChart />
                                    Metrics
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex-grow flex justify-center">
                        <SearchBar/>
                    </div>
                    <div className="w-[88px]"></div>
                </div>  
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    </div>
                ) : (
                    <div className="overflow-y-auto no-scrollbar px-48 pt-2">
                        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-16">
                            {activeTab === 'metrics' ? (
                                <div className="w-full col-span-full">
                                    <LibraryMetrics library={libraryOmdb} watchlist={watchlistOmdb} />
                                </div>
                            ) : (
                                (activeTab === 'library' ? libraryMovies : watchlistMovies).map(imdbID => (
                                    <div key={imdbID} className="w-full pb-[130%] relative">
                                        {moviePosters[imdbID] && (
                                            <div className="absolute">
                                                <PosterButtons
                                                    width={"80%"}
                                                    height={"80%"}
                                                    imdbID={imdbID}
                                                    posterLink={moviePosters[imdbID]}
                                                    onLibraryClick={() => handleLibraryClick(imdbID)}
                                                    onWatchlistClick={() => handleWatchlistClick(imdbID)}
                                                    inLibrary={libraryMovies.includes(imdbID)}
                                                    inWatchlist={watchlistMovies.includes(imdbID)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
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