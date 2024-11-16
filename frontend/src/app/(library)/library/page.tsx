import { auth } from "@/lib/auth/authConfig";
import { LibraryClientWrapper } from "@/app/(library)/LibraryClientWrapper";

const MWAPI = process.env.NEXT_PUBLIC_MWAPI;
const OMDBAPI_URL = process.env.NEXT_PUBLIC_OMDBAPI_URL;
const OMDBAPI_KEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY;

export default async function LibraryPage() {
    const session = await auth();
    
    if (!session?.user?.email) {
        return null;
    }

    // Fetch initial data server-side
    const [libraryData, watchlistData] = await Promise.all([
        fetch(`${MWAPI}/users/${session.user.email}/library`),
        fetch(`${MWAPI}/users/${session.user.email}/watchlist`)
    ]);

    const [library, watchlist] = await Promise.all([
        libraryData.json(),
        watchlistData.json()
    ]);

    // Fetch OMDB data server-side
    const allMovies = [...library, ...watchlist];
    const movieData = await Promise.all(
        allMovies.map(imdbID =>
            fetch(`${OMDBAPI_URL}?i=${imdbID}&apikey=${OMDBAPI_KEY}`)
                .then(res => res.json())
        )
    );

    return (
        <LibraryClientWrapper 
            initialLibrary={library}
            initialWatchlist={watchlist}
            initialMovieData={movieData}
        />
    );
}
