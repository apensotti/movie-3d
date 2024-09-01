// page.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import Matrix from '../components/matrix';
import { useEffect, useState } from "react";
import { MatrixProps } from '../data/props';

export default function Home() {
  const [data, setData] = useState<MatrixProps>({ nodes: [], links: [] });

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
        <Matrix nodes={data.nodes} links={data.links} />
  );
}
