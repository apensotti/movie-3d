"use client";

import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { GraphData } from '../data/types';

import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function Matrix({ nodes, links }) {
  const nodeThreeObject = () => {
    const geometry = new THREE.SphereGeometry(1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: false });
    const sphere = new THREE.Mesh(geometry, material);

    // Disable shadow casting and receiving
    sphere.castShadow = false;
    sphere.receiveShadow = false;

    return sphere;
  };

  const nodeLabel = node => {
    // Create a div element for the label
    const nodeEl = document.createElement('div');
    nodeEl.textContent = node.name || "Unnamed";  // Assuming your node has a 'name' property
    nodeEl.style.color = '#000000'; // Customize the text color
    nodeEl.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'; // Optional background color
    nodeEl.style.padding = '2px 5px'; // Optional padding for better readability
    nodeEl.style.borderRadius = '3px'; // Optional border radius

    return new CSS2DObject(nodeEl);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ForceGraph3D
        graphData={{ nodes, links }}
        backgroundColor="#000000"
        nodeThreeObject={nodeThreeObject}
        linkOpacity={0.03}
        nodeRelSize={1}
        enableNodeDrag={false}
        showNavInfo={false}
        warmupTicks={23}
        cooldownTicks={10}
        nodeLabel={node => node.title}
      />
    </div>
  );
}
