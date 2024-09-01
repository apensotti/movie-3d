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
  source: string | number | undefined;
  target: string | number | undefined;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface NodeObject {
  id?: string | number;
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
  fx?: number;
  fy?: number;
  fz?: number;
  [others: string]: any; // Allow additional properties
}