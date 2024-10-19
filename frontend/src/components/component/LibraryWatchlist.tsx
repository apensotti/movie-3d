'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import PosterButtons from './PosterButtons';
import { IoLibrary } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { useRouter, useSearchParams } from 'next/navigation';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL;
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY;

interface LibraryWatchlistProps {
  initialActiveTab?: 'library' | 'watchlist';
}

export default function LibraryWatchlist({ initialActiveTab = 'library' }: LibraryWatchlistProps) {
    const [activeTab, setActiveTab] = useState(initialActiveTab);
    const [libraryMovies, setLibraryMovies] = useState<string[]>([]);
    const [watchlistMovies, setWatchlistMovies] = useState<string[]>([]);
    const [moviePosters, setMoviePosters] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tab = searchParams.get('w') === '1' ? 'watchlist' : 'library';
        setActiveTab(tab);
    }, [searchParams]);

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
    }, [session]);

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

    const handleTabChange = (tab: 'library' | 'watchlist') => {
        setActiveTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set('w', tab === 'watchlist' ? '1' : '0');
        router.push(`/library?${params.toString()}`);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex relative">
                <button
                    className={`flex-1 py-2 px-4 text-center rounded-t-xl flex items-center justify-center ${activeTab === 'library' ? 'bg-violet-800 text-white z-10' : 'bg-neutral-850'} shadow-lg relative`}
                    onClick={() => handleTabChange('library')}
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
                    onClick={() => handleTabChange('watchlist')}
                    style={{
                        clipPath: 'inset(-5px -5px 0px -5px)',
                        marginLeft: '-10px'
                    }}
                >
                    <FaStar className="mr-2" />
                    Watchlist
                </button>
            </div>
            <div className='bg-neutral-850 p-4 rounded-b-xl shadow-lg flex-grow overflow-hidden'>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    </div>
                ) : (
                    <div className="overflow-y-auto h-full no-scrollbar">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 pb-4">
                            {(activeTab === 'library' ? libraryMovies : watchlistMovies).map(imdbID => (
                                <div key={imdbID} className="w-full pb-[150%] relative">
                                    {moviePosters[imdbID] && (
                                        <div className="absolute inset-0">
                                            <PosterButtons
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
        </div>
    );
}
