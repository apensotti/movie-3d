"use client";

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { Input } from './ui/input';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

export default function Matrix({ nodes, links }) {
  const labelRendererRef = useRef(null);

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

  return (
    <div className="relative w-screen h-screen">
      {/* Conditionally render ForceGraph3D only when the renderer is set */}
      {labelRendererRef.current && (
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
          onNodeHover={onNodeHover} // Use onNodeHover callback
          extraRenderers={[labelRendererRef.current]} // Attach CSS2DRenderer to render HTML labels
        />
      )}

      {/* Tailwind CSS Input centered at the bottom */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs pb-2">
        <Input
          type="text"
          className="w-full rounded-full align-middle"
          placeholder="Message MovieGPT"
        />
      </div>
    </div>
  );
}
