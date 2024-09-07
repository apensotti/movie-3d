"use client";
import React from 'react';
import Matrix from '../components/matrix';
import { useEffect, useState } from "react";
import { GraphData } from "../data/types";
import { omdb } from '../data/types';
import Movies from '../components/movies';
import { Input } from '../components/ui/input';

export default function Home() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [ids, setIds] = React.useState([
    'tt0114709', 'tt0113497', 'tt0113228', 'tt0114885', 'tt0113041', 'tt6209470', 'tt2028550', 'tt0303758',
  ]);
  const [movies, setMovies] = React.useState([] as omdb[]);
  const [showForceGraph, setShowForceGraph] = useState(false);

  useEffect(() => {
    fetch('data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      const promises = ids.map(async (id) => {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=f523276c`);
        const data = await response.json();
        return data;
      });
      const results = await Promise.all(promises);
      setMovies(results);
    };
    fetchMovies();
  }, [ids]);

  const renderGraph = () => {
    switch (showForceGraph) {
      case true:
        return <Matrix nodes={data.nodes} links={data.links} />;
      case false:
        return <div>Force graph is hidden</div>;
    }
  };

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-neutral-950">
        {renderGraph()}

        {/* Input component */}
        <div className="absolute bottom-5 left-80 transform -translate-x-1/2 w-full max-w-96 pb-2 z-50 scale-150 shadow-black shadow-2xl">
          <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Summon the Wizard..."
          />
        </div>

        {/* Overflow-hidden container with Movies inside */}
        <div className="absolute bottom-16 left-60 transform translate-y-1 -translate-x-1/2 w-full h-full overflow-hidden z-40">
          {/* Movies component inside the container */}
          <div className="w-full">
            <Movies movies={movies} />
          </div>
        </div>
      </div>
    </>
  );
}
