"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { useRouter } from 'next/router'; // Import Next.js router
import { Input } from './ui/input';
import Movies from './movies';
import Router from 'next/router';
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function Matrix({ nodes, links }) {
  const labelRendererRef = useRef(null);
  const router = Router; // Initialize Next.js router
  const [loading, setLoading] = useState(true); // Loading state for initial load

  useEffect(() => {
    // Initialize the CSS2DRenderer on the client side
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = 0;
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRendererRef.current = labelRenderer;
  }, []);

  const nodeThreeObject = () => {
    const geometry = new THREE.SphereGeometry(1, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: false });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = false;
    sphere.receiveShadow = false;
    return sphere;
  };

  const onNodeHover = (node, prevNode) => {
    if (prevNode && prevNode.__label) {
      prevNode.__threeObj.remove(prevNode.__label); // Remove previous label
      prevNode.__label = null;
    }

    if (node) {
      const nodeEl = document.createElement('div');
      nodeEl.innerHTML = `<strong>${node.title || "Unnamed"}</strong>`;
      nodeEl.style.width = '100px';
      nodeEl.style.color = '#ffffff';
      nodeEl.style.backgroundColor = '#44403c';
      nodeEl.style.padding = '2px 5px';
      nodeEl.style.borderRadius = '3px';

      const label = new CSS2DObject(nodeEl);
      label.position.set(0, 0, 0); // Attach at the node's position
      node.__threeObj.add(label); // Add label to the node's 3D object
      node.__label = label; // Store label reference for removal later
    }
  };

  const onNodeClick = (node) => {
    if (node && node.id) {
      // Navigate to the movie detail page using Next.js router
      window.open(`/movies/${node.id}`, '_blank');
    }
  };

  return (
    <>
      {labelRendererRef.current && (
        <>
          <ForceGraph3D
            graphData={{ nodes, links }}
            backgroundColor="#171717"
            nodeThreeObject={nodeThreeObject}
            linkOpacity={0.02}
            enableNodeDrag={false}
            showNavInfo={false}
            warmupTicks={23}
            cooldownTicks={10}
            onNodeHover={onNodeHover}
            onNodeClick={onNodeClick} // Add the click handler here
            extraRenderers={[labelRendererRef.current]}
            onEngineStop={() => setLoading(false)}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          )}
        </>
      )}
    </>
  );
}
