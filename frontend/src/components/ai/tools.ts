import { z } from 'zod';
import { tool as createTool, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Import necessary functions and constants

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;
const TMDB = process.env.NEXT_PUBLIC_TMDB!;
const TMDBKEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;
const CELEBRITY_API = process.env.NEXT_PUBLIC_CELEBRITY_API!;
const CELEBRITY_API_KEY = process.env.NEXT_PUBLIC_CELEBRITY_API_KEY!;

const searchVDB = async (query: string) => {
    const response = await fetch(`${MWAPI}/search/similarity/?query=${encodeURIComponent(query)}&k=25`);
    if (!response.ok) throw new Error('Error fetching movie IDs');
    return response.json();
  };
  
  const getMovieData = async (ids: string[]) => {
    const moviePromises = ids.map(async (id) => {
      const response = await fetch(`${OMBDAPI}?i=${id}&plot=full&apikey=${OMBDKEY}`);
      return response.json();
    });
    const movieData = await Promise.all(moviePromises);
    return movieData;
  };
  
  const searchActor = async (name: string) => {
    const response = await fetch(`${TMDB}/search/person?query=${encodeURIComponent(name)}&api_key=${TMDBKEY}`);
    const celebrityResponse = await fetch(`${CELEBRITY_API}/celebrity?name=${encodeURIComponent(name)}`, {
      headers: {
        'X-Api-Key': CELEBRITY_API_KEY
      }
    });
    const data = await response.json();
    const celebrityData = await celebrityResponse.json();
    return {tmdb: data.results[0], data: celebrityData}; // Assuming we want the first result
  };
  
  const getActorImage = async (poster_path: string) => {
    const imageUrl = `${TMDBIMAGEURL}${poster_path}`;
    return imageUrl; // Return the full image URL instead of fetching it
  };
  
  const getTMDBid = async (imdb_id: string) => {
    const response = await fetch(`${TMDB}/find/${imdb_id}?external_source=imdb_id&api_key=${TMDBKEY}`);
    const data = await response.json();
    return data.movie_results[0].id;
  };
  
  const getMovieReviews = async (tmdb_id: string) => {
    const response = await fetch(`${TMDB}/movie/${tmdb_id}/reviews?api_key=${TMDBKEY}`);
    const data = await response.json();
    return data.results;
  };

export const tools = {
  describeMovie: createTool({
    description: 'Get movie data based on a description of the movie eg movie about this, movie where this happens. Use steps 1. respond with an affirmation of the request. 2. use the searchMovies tool to find movies. 3. return the movies in a list.',
    parameters: z.object({
      query: z.string().describe('The description of the movie.'),
    }),
    execute: async function ({ query }) {
      const ids = await searchVDB(query);
      const movies = await getMovieData(ids);
      return movies;
    },
  }),

  searchMovies: createTool({
    description: 'Search for movies based on titles, keywords, date range, cast, and crew. eg Batman, movies between 2020 and 2024, movies with cast member Tom Hanks and crew member Steven Spielberg.',
    parameters: z.object({
      title: z.string().optional().describe('Title of a movie'),
      keywords: z.array(z.string()).optional().describe('Keywords of a movie'),
      startDate: z.string().optional().describe('Date range start of movies'),
      endDate: z.string().optional().describe('Date range end of movies'),
      cast: z.array(z.string()).optional().describe('Cast of a movie'),
      crew: z.array(z.string()).optional().describe('Crew of a movie'),
    }),
    execute: async function ({ title, keywords, startDate, endDate, cast, crew }) {
      let url = `${MWAPI}/search/movies/?`;

      if (title) url += `title=${encodeURIComponent(title)}`;
      if (keywords?.length) url += `&keywords=${encodeURIComponent(keywords.join(','))}`;
      if (startDate && endDate) url += `&date_range=${encodeURIComponent(`${startDate},${endDate}`)}`;
      if (cast?.length) url += `&cast=${encodeURIComponent(cast.join(','))}`;
      if (crew?.length) url += `&crew=${encodeURIComponent(crew.join(','))}`;

      const response = await fetch(url);
      const ids = await response.json();
      const movies = await getMovieData(ids);

      return movies;
    },
  }),

  getActorInfo: createTool({
    description: ' Based on an actor name, find the actor and their movies. If the user says something like "what movies is this actor in" or "what movies has this actor been in" use this tool. If the users asks about a character and who played that character, use this tool.',
    parameters: z.object({
      name: z.string().describe('The name of the actor to search for.'),
    }),
    execute: async function ({ name }) {
      try {
        const {tmdb, data} = await searchActor(name);
        const imageUrl = tmdb.profile_path ? await getActorImage(tmdb.profile_path) : null;
        const response = await fetch(`${MWAPI}/search/movies/?cast=${encodeURIComponent(name)}`);

        const actorMovies = await response.json();
        const movies = await getMovieData(actorMovies);
        const returnObject = {movies, imageUrl, tmdb, data};

        return returnObject;
      } catch (error) {
        console.error('Error in getActorInfo:', error);
        return { error: 'Unable to fetch actor information' };
      }
    },
  }),

  getMovieReview: createTool({
    description: 'Summarize reviews of a movie into TWO short paragraphs. If the user says something like "what are the reviews for this movie" or "what do people say about this movie" use this tool.',
    parameters: z.object({
      title: z.string().describe('The title of the movie to search for.'),
    }),
    execute: async function ({ title }) {
      try {
        const response = await fetch(`${OMBDAPI}?t=${encodeURIComponent(title)}&plot=full&apikey=${OMBDKEY}`);
        const data = await response.json();
        const tmdb_id = await getTMDBid(data.imdbID);
        const getReviews = await getMovieReviews(tmdb_id);

        return getReviews;
      } catch (error) {
        console.error('Error in getMovieReview:', error);
        return { error: 'Unable to fetch movie reviews' };
      }
    },
    
  },
),
  
};

