"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import Router from 'next/router';
import { useFetchGraphData } from "@/hooks/hooks";

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

const Matrix = ({ ids }) => {
  const MWAPI = process.env.NEXT_PUBLIC_MWAPI;
  const labelRendererRef = useRef(null);
  const router = Router;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ nodes: [], links: [] });

  useFetchGraphData(ids, MWAPI, setData);

  const nodes = data.nodes;
  const links = data.links;

  useEffect(() => {
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = 0;
    labelRenderer.domElement.style.pointerEvents = 'none';
    labelRendererRef.current = labelRenderer;
  }, []);

  const nodeThreeObject = (node) => {
    const radius = Math.max(1, Math.log(node.size + 1));
    const geometry = new THREE.SphereGeometry(radius, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    return new THREE.Mesh(geometry, material);
  };

  const onNodeHover = (node, prevNode) => {
    if (prevNode && prevNode.__label) {
      prevNode.__threeObj.remove(prevNode.__label);
      prevNode.__label = null;
    }

    if (node) {
      const nodeEl = document.createElement('div');
      nodeEl.innerHTML = `<strong>${node.title || "Unnamed"}</strong>`;
      nodeEl.style.color = '#ffffff';
      nodeEl.style.backgroundColor = '#44403c';
      nodeEl.style.padding = '2px 5px';
      nodeEl.style.borderRadius = '3px';

      const label = new CSS2DObject(nodeEl);
      label.position.set(0, 0, 0);
      node.__threeObj.add(label);
      node.__label = label;
    }
  };

  const onNodeClick = (node) => {
    if (node && node.id) {
      window.open(`/movies/${node.id}`, '_blank');
    }
  };

  return (
    <div className='z-40 w-screen h-screen'>
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
            onNodeClick={onNodeClick}
            extraRenderers={[labelRendererRef.current]}
            onEngineStop={() => setLoading(false)}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 z-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Use React.memo to memoize the component
export default React.memo(Matrix, (prevProps, nextProps) => {
  // Only rerender if the `ids` prop changes
  return prevProps.ids === nextProps.ids;
});
