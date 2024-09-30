import { SimulationNodeDatum } from 'd3-force';

export interface Node {
  id: string;
  title: string;
  index: number;
  populartiy: number;
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
  title?: string;
  populartiy?: number;
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

export interface omdb{
  Title:string,
  Year:string,
  Rated:string,
  Released:string,
  Runtime:string,
  Genre:string,
  Director:string,
  Writer:string,
  Actors:string,
  Plot: string,
  Language:string,
  Country:string,
  Awards:string,
  Poster:string,
  Ratings:{Source:string,Value:string}[],
  Metascore:string,
  imdbRating:string,
  imdbVotes:string,
  imdbID:string,
  Type:string,
  DVD:string,
  BoxOffice:string,
  Production:string,
  Website:string,
  Response:string}

  export interface Messages {
    additional_kwargs?: any;
    example?: boolean;
    id?: string;
    name?: string;
    response_metadata?: any;
    type: string;
    content: string;
  }