"use client";

import Image from "next/image";
import ForceGraph3D from 'react-force-graph-3d';
import { useEffect, useState } from "react";
import * as THREE from 'three';
import { Textarea } from "../components/ui/textarea";

export default function Home() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  const nodeThreeObject = () => {
    const geometry = new THREE.SphereGeometry(1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: false });
    const sphere = new THREE.Mesh(geometry, material);

    // Disable shadow casting and receiving
    sphere.castShadow = false;
    sphere.receiveShadow = false;

    return sphere;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ForceGraph3D
        graphData={data}
        backgroundColor="#000000"
        nodeThreeObject={nodeThreeObject}
        linkOpacity={0.01}
        nodeRelSize={1}
        d3AlphaDecay={.01}
        enableNodeDrag={false}
      />
      <Textarea
        placeholder="Enter your text here..."
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '20px',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          padding: '10px',
          borderRadius: '100px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center', // Optionally center text horizontally as well
          textAlign: 'left', // Ensure the placeholder text is centered within the Textarea
        }}
      />
    </div>
  );
}
