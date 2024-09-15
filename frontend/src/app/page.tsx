"use client";

import React, { useEffect, useState } from "react";
import Matrix from '../components/matrix';
import { GraphData } from "../data/types";
import { omdb } from '../data/types';
import Movies from '../components/movies';
import { Input } from '../components/ui/input';

export default function Home() {
  const MWAPI = process.env.NEXT_PUBLIC_MWAPI; // MovieWizard API base URL
  const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI; // OMDB API base URL

  const [query, setQuery] = useState<string>(''); // Initially set to empty string
  const [debouncedQuery, setDebouncedQuery] = useState<string>(''); 
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [ids, setIds] = useState<string[]>([
    'tt0114709', 'tt0113497', 'tt0113228', 'tt0114885', 'tt0113041', 'tt6209470', 'tt2028550', 'tt0303758',
  ]);
  const [movies, setMovies] = useState([] as omdb[]);
  const [showForceGraph, setShowForceGraph] = useState(true);
  const [isMovieMenuOpen, setIsMovieMenuOpen] = useState(false);

  // Load the query from localStorage on the first render (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = window.localStorage.getItem('query');
      if (savedQuery) {
        setQuery(savedQuery); // Load query from localStorage if it exists
      }
    }
  }, []);

  // Debounce query input to prevent too many API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());  // Set debounced query after 900ms of inactivity
      // Save the query to localStorage whenever it changes
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('query', query); // Store query in localStorage
      }
    }, 900);  // Debounce by 900ms
  
    return () => {
      clearTimeout(handler); // Clear the timeout if the user keeps typing
    };
  }, [query]); // Only trigger when `query` changes

  // Fetch Graph Data based on `ids`
  useEffect(() => {
    if (ids.length > 0) {
      fetch(`${MWAPI}/generate_graph/?ids=[${ids.map((id) => `"${id}"`).join(',')}]`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch');
          return res.json();
        })
        .then((data) => {
          setData(data); // Resume animation after data is fetched
        })
        .catch((err) => console.error(err));
    }
  }, [ids, MWAPI]);

  // Fetch movie IDs based on the `debouncedQuery`
  useEffect(() => {
    const fetchIDs = async (query: string) => {
      try {
        const response = await fetch(`${MWAPI}/search/?query=${encodeURIComponent(query)}&k=50`);
        if (!response.ok) {
          throw new Error("Error fetching movie IDs");
        }
        const data = await response.json();
        setIds(data.results);  // Assuming data.results contains the array of movie IDs
      } catch (error) {
        console.error("Error fetching IDs:", error);
      }
    };
    
    if (debouncedQuery) {
      fetchIDs(debouncedQuery); // Trigger the API call only when the debouncedQuery changes
    }
  }, [debouncedQuery, MWAPI]); // This effect triggers only when `debouncedQuery` is updated

  // Fetch movie details based on `ids`
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const promises = ids.map(async (id) => {
          const response = await fetch(`${OMBDAPI}&i=${id}`);
          const data = await response.json();
          return data;
        });
        const results = await Promise.all(promises);
        setMovies(results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    if (ids.length > 0) {
      fetchMovies();
    }
  }, [ids, OMBDAPI]);

  const renderGraph = () => {
    if (showForceGraph) {
      return <Matrix nodes={data.nodes} links={data.links}/>; // Pass pauseAnimation as a prop
    } else {
      return <div>Force graph is hidden</div>;
    }
  };

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        <div className='z-40 w-screen h-screen'>
          {renderGraph()}        
        </div>
        {/* Input component */}
        <div className="absolute bottom-5 left-64 transform -translate-x-1/2 w-full max-w-96 pb-2 z-50 scale-125">
          <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Summon the Wizard..."
            value={query}
            onInput={(e) => setQuery(e.currentTarget.value)}  // Update query directly
          />
        </div>

        {/* Overflow-hidden container with Movies inside */}
        <div className={`absolute bottom-16 left-60 transform translate-y-3 -translate-x-1/2 w-96 z-40 overflow-hidden transition-all duration-1 ${isMovieMenuOpen ? 'h-100' : 'h-9'}`}>
          <div className="w-full">
            <Movies movies={movies} isVisible={isMovieMenuOpen} setIsVisible={setIsMovieMenuOpen} />
          </div>
        </div>

      </div>
    </>
  );
}
