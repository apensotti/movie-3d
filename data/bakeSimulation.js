import * as d3 from 'd3-force';
import * as fs from 'fs';
import data from '../public/data.json' assert { type: 'json' };

const nodes = data.nodes;
const links = data.links;

// Custom force to pull nodes towards z=0
const forceZ = () => {
  nodes.forEach(node => {
    if (node.z) {
      node.vz += -node.z * 0.005; // Weaker pull towards z=0
    }
  });
};

// Create the simulation
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
    .id(d => d.id)
    .distance(1) // Link distance
    .strength(1) // Stronger link strength
  )
  .force('charge', d3.forceManyBody()
    .strength(-10) // Weaker repulsive force
  )
  .force('center', d3.forceCenter(0, 0))
  .force('forceZ', forceZ)
  .force('y', d3.forceY(0).strength(0.1))
  .force('x', d3.forceX(0).strength(0.1))
  .velocityDecay(0.4); // Damping factor

// Run the simulation for a fixed number of iterations
for (let i = 0; i < 50; i++) {
  simulation.tick();
}

// Save the final positions
const output = { nodes, links };
fs.writeFileSync('data_baked.json', JSON.stringify(output, null, 2));
