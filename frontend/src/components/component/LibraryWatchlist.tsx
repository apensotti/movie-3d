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

interface Props {
    initialLibrary: string[];
    initialWatchlist: string[];
    initialPosters: Record<string, string>;
    initialLibraryOmdb: omdb[];
    initialWatchlistOmdb: omdb[];
    onLibraryUpdate: (library: string[]) => void;
    onWatchlistUpdate: (watchlist: string[]) => void;
    onPostersUpdate: (posters: Record<string, string>) => void;
    onLibraryOmdbUpdate: (library: omdb[]) => void;
    onWatchlistOmdbUpdate: (watchlist: omdb[]) => void;
}

export function LibraryWatchlist({
    initialLibrary,
    initialWatchlist,
    initialPosters,
    initialLibraryOmdb,
    initialWatchlistOmdb,
    onLibraryUpdate,
    onWatchlistUpdate,
    onPostersUpdate,
    onLibraryOmdbUpdate,
    onWatchlistOmdbUpdate
}: Props) {
    const [activeTab, setActiveTab] = useState('library');
    const [libraryMovies, setLibraryMovies] = useState<string[]>(initialLibrary);
    const [watchlistMovies, setWatchlistMovies] = useState<string[]>(initialWatchlist);
    const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>(initialPosters);
    const [libraryOmdb, setLibraryOmdb] = useState<omdb[]>(initialLibraryOmdb);
    const [watchlistOmdb, setWatchlistOmdb] = useState<omdb[]>(initialWatchlistOmdb);
    const [recommendationMovies, setRecommendationMovies] = useState<omdb[]>([]);
    const { data: session } = useSession();

    const [lastFetchTime, setLastFetchTime] = useState<number>(0);

    useEffect(() => {
        const loadFromLocalStorage = () => {
            const stored = {
                library: JSON.parse(localStorage.getItem('libraryMovies') || '[]'),
                watchlist: JSON.parse(localStorage.getItem('watchlistMovies') || '[]'),
                posters: JSON.parse(localStorage.getItem('moviePosters') || '{}'),
                libraryOmdb: JSON.parse(localStorage.getItem('libraryOmdb') || '[]'),
                watchlistOmdb: JSON.parse(localStorage.getItem('watchlistOmdb') || '[]'),
                lastFetch: Number(localStorage.getItem('lastFetchTime') || '0')
            };

            setLibraryMovies(stored.library);
            setWatchlistMovies(stored.watchlist);
            setMoviePosters(stored.posters);
            setLibraryOmdb(stored.libraryOmdb);
            setWatchlistOmdb(stored.watchlistOmdb);
            setLastFetchTime(stored.lastFetch);
        };

        const fetchMovies = async () => {
            const userEmail = session?.user?.email;
            if (!userEmail) return;

            try {
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

                // Save to localStorage
                localStorage.setItem('libraryMovies', JSON.stringify(libraryData));
                localStorage.setItem('watchlistMovies', JSON.stringify(watchlistData));
                localStorage.setItem('moviePosters', JSON.stringify(Object.assign({}, ...posters)));
                localStorage.setItem('libraryOmdb', JSON.stringify(movies.filter(movie => libraryData.includes(movie.imdbID))));
                localStorage.setItem('watchlistOmdb', JSON.stringify(movies.filter(movie => watchlistData.includes(movie.imdbID))));
                localStorage.setItem('lastFetchTime', Date.now().toString());
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        // Load initial data from localStorage
        loadFromLocalStorage();

        // Only fetch if data is older than 5 minutes or doesn't exist
        const FIVE_MINUTES = 5 * 60 * 1000;
        if (Date.now() - lastFetchTime > FIVE_MINUTES) {
            fetchMovies();
        }
    }, [session]);

    useEffect(() => {
        const fetchRecs = async () => {
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
            
            const newLibraryMovies = action === 'add' ? [...libraryMovies, imdbID] : libraryMovies.filter(id => id !== imdbID);
            const newWatchlistMovies = action === 'add' ? watchlistMovies.filter(id => id !== imdbID) : watchlistMovies;
            
            setLibraryMovies(newLibraryMovies);
            setWatchlistMovies(newWatchlistMovies);
            
            // Update localStorage
            localStorage.setItem('libraryMovies', JSON.stringify(newLibraryMovies));
            localStorage.setItem('watchlistMovies', JSON.stringify(newWatchlistMovies));
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
            
            const newWatchlistMovies = action === 'add' ? [...watchlistMovies, imdbID] : watchlistMovies.filter(id => id !== imdbID);
            const newLibraryMovies = action === 'add' ? libraryMovies.filter(id => id !== imdbID) : libraryMovies;
            
            setWatchlistMovies(newWatchlistMovies);
            setLibraryMovies(newLibraryMovies);
            
            // Update localStorage
            localStorage.setItem('watchlistMovies', JSON.stringify(newWatchlistMovies));
            localStorage.setItem('libraryMovies', JSON.stringify(newLibraryMovies));
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
            </div>
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