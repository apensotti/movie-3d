'use client';

import { useState } from 'react';
import { omdb } from '@/data/types';
import { LibraryWatchlist } from '@/components/component/LibraryWatchlist';

interface Props {
    initialLibrary: string[];
    initialWatchlist: string[];
    initialMovieData: omdb[];
}

export function LibraryClientWrapper({ 
    initialLibrary, 
    initialWatchlist, 
    initialMovieData 
}: Props) {
    const [libraryMovies, setLibraryMovies] = useState(initialLibrary);
    const [watchlistMovies, setWatchlistMovies] = useState(initialWatchlist);
    
    const initialPosters = Object.fromEntries(
        initialMovieData.map(movie => [movie.imdbID, movie.Poster])
    );
    
    // Split initialMovieData into library and watchlist OMDB data
    const initialLibraryOmdb = initialMovieData.filter(movie => 
        initialLibrary.includes(movie.imdbID)
    );
    const initialWatchlistOmdb = initialMovieData.filter(movie => 
        initialWatchlist.includes(movie.imdbID)
    );
    
    const [moviePosters, setMoviePosters] = useState(initialPosters);
    const [libraryOmdb, setLibraryOmdb] = useState(initialLibraryOmdb);
    const [watchlistOmdb, setWatchlistOmdb] = useState(initialWatchlistOmdb);

    return (
        <LibraryWatchlist
            initialLibrary={libraryMovies}
            initialWatchlist={watchlistMovies}
            initialPosters={moviePosters}
            initialLibraryOmdb={libraryOmdb}
            initialWatchlistOmdb={watchlistOmdb}
            onLibraryUpdate={setLibraryMovies}
            onWatchlistUpdate={setWatchlistMovies}
            onPostersUpdate={setMoviePosters}
            onLibraryOmdbUpdate={setLibraryOmdb}
            onWatchlistOmdbUpdate={setWatchlistOmdb}
        />
    );
}