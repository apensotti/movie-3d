import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export const useUserLibrary = (MWAPI: string) => {
  const { data: session } = useSession();
  const [library, setLibrary] = useState<string[]>([]);

  const fetchLibrary = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`${MWAPI}/users/${session.user.email}/library`);
        if (!response.ok) throw new Error('Failed to fetch library');
        const data = await response.json();
        setLibrary(data);
      } catch (error) {
        console.error('Error fetching library:', error);
      }
    }
  }, [MWAPI, session]);

  useEffect(() => {
    fetchLibrary();
  }, [fetchLibrary]);

  const addToLibrary = useCallback(async (movieId: string) => {
    if (session?.user?.email) {
      try {
        const updatedLibrary = [...library, movieId];
        const response = await fetch(`${MWAPI}/users/${session.user.email}/library`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedLibrary),
        });
        if (!response.ok) throw new Error('Failed to update library');
        setLibrary(updatedLibrary);
      } catch (error) {
        console.error('Error updating library:', error);
      }
    }
  }, [MWAPI, session, library]);

  const removeFromLibrary = useCallback(async (movieId: string) => {
    if (session?.user?.email) {
      try {
        const updatedLibrary = library.filter(id => id !== movieId);
        const response = await fetch(`${MWAPI}/users/${session.user.email}/library`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedLibrary),
        });
        if (!response.ok) throw new Error('Failed to update library');
        setLibrary(updatedLibrary);
      } catch (error) {
        console.error('Error updating library:', error);
      }
    }
  }, [MWAPI, session, library]);

  return { library, addToLibrary, removeFromLibrary };
};

export const useUserWatchlist = (MWAPI: string) => {
  const { data: session } = useSession();
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const fetchWatchlist = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`${MWAPI}/users/${session.user.email}/watchlist`);
        if (!response.ok) throw new Error('Failed to fetch watchlist');
        const data = await response.json();
        setWatchlist(data);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    }
  }, [MWAPI, session]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = useCallback(async (movieId: string) => {
    if (session?.user?.email) {
      try {
        const updatedWatchlist = [...watchlist, movieId];
        const response = await fetch(`${MWAPI}/users/${session.user.email}/watchlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedWatchlist),
        });
        if (!response.ok) throw new Error('Failed to update watchlist');
        setWatchlist(updatedWatchlist);
      } catch (error) {
        console.error('Error updating watchlist:', error);
      }
    }
  }, [MWAPI, session, watchlist]);

  const removeFromWatchlist = useCallback(async (movieId: string) => {
    if (session?.user?.email) {
      try {
        const updatedWatchlist = watchlist.filter(id => id !== movieId);
        const response = await fetch(`${MWAPI}/users/${session.user.email}/watchlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedWatchlist),
        });
        if (!response.ok) throw new Error('Failed to update watchlist');
        setWatchlist(updatedWatchlist);
      } catch (error) {
        console.error('Error updating watchlist:', error);
      }
    }
  }, [MWAPI, session, watchlist]);

  return { watchlist, addToWatchlist, removeFromWatchlist };
};
