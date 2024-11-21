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

export interface MovieDatabase {
  adult: boolean;
  belongs_to_collection: string | null;
  budget: number;
  genres: string[];
  homepage: string | null;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: string[];
  production_countries: string[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: string[];
  status: string;
  tagline: string | null;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  cast: string[];
  crew: string[];
  keywords: string[];
  textual_representation: string;
  plot: string;
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

  export interface tmdb {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  imdb_id?: string;
  }

  export interface Messages {
    additional_kwargs?: any;
    example?: boolean;
    id?: string;
    name?: string;
    response_metadata?: any;
    type: string;
    content: string;
  }