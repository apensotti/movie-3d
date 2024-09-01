// matrix.tsx

"use client";

import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { MatrixProps } from '../data/props';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function Matrix({ nodes, links }: MatrixProps) {
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
        graphData={{ nodes, links }}
        backgroundColor="#000000"
        nodeThreeObject={nodeThreeObject}
        linkOpacity={0.01}
        nodeRelSize={1}
        enableNodeDrag={false}
        showNavInfo={false}
      />
    </div>
  );
}
