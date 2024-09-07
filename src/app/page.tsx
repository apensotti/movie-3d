// page.tsx

"use client";
import React from 'react';
import Matrix from '../components/matrix';
import { useEffect, useState } from "react";
import { GraphData } from "@/data/types";
import { omdb } from '@/data/types';
import Movies from '@/components/movies';
import {Input} from '@/components/ui/input';


export default function Home() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [ids, setIds] = React.useState(['tt0114709','tt0113497','tt0113228','tt0114885','tt0113041','tt6209470','tt2028550','tt0303758'])
  const [movies, setMovies] = React.useState([] as omdb[])
  

  useEffect(() => {
    fetch('data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
        const promises = ids.map(async (id) => {
            const response = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=f523276c`)
            const data = await response.json()
            return data
        })
        const results = await Promise.all(promises)
        setMovies(results)
    }
    fetchMovies()
  }, [ids])

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden">
        <Matrix nodes={data.nodes} links={data.links}/>     
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs pb-2 z-50">
          <Input
            type="text"
            className="w-full rounded-full align-middle"
            placeholder="Message MovieGPT"
          />
        </div>
        <div className='absolute bottom-28 right-44 transform w-full max-w-xs pb-2 z-50'>
          <Movies movies={movies} />
        </div>
      </div>
    </>
  );
}
