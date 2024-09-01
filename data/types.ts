import { SimulationNodeDatum } from 'd3-force';

export interface Node {
  id: string;
  title: string;
  index: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
}

export interface Link {
  source: string | number;
  target: string | number;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}
