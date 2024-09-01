// page.tsx

"use client";

import { Canvas } from "@react-three/fiber";
import Matrix from '../components/matrix';
import { useEffect, useState } from "react";
import { GraphData } from '../data/types';

export default function Home() {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });

  useEffect(() => {
    fetch('data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
        <Matrix nodes={data.nodes} links={data.links} />
  );
}
