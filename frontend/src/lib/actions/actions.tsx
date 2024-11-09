'use server';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId, generateText } from 'ai';
import MovieCardMd from '@/components/component/MovieCardMd';
import { omdb, MovieDatabase } from '@/data/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import MovieCardSm from '@/components/component/MovieCardSm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL!;
const OMBDKEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY!;
const TMDB = process.env.NEXT_PUBLIC_TMDB!;
const TMDBKEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;

const searchVDB = async (query: string) => {
  const response = await fetch(`${MWAPI}/search/similarity/?query=${encodeURIComponent(query)}&k=5`);
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
  const data = await response.json();
  return data.results[0]; // Assuming we want the first result
};

const getActorImage = async (poster_path: string) => {
  const imageUrl = `${TMDBIMAGEURL}${poster_path}`;
  return imageUrl; // Return the full image URL instead of fetching it
};

// const MovieComponent = (props: omdb | MovieDatabase) => <MovieCardMd movies={props} />;

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

const isToolRequired = (input: string) => {
  return input.toLowerCase().includes('movie') || input.toLowerCase().includes('film');
};

export async function continueConversation(input: string): Promise<ClientMessage> {
  const history = getMutableAIState();

  const systemPrompt = `
    You are a movie assistant that can use tools to find movies based on descriptions and answer questions about those movies.
    
    describeMovie: Based on a movie description, find movies that match the description. 
    searchMovies: IF @search is in the input, USE THIS TOOL. Search for movies based on titles, keywords, date range, cast, and crew. Used for specific queries like titles, keywords, date range, cast, and crew.

    use a combination of tools when needed.
    `;

  const result = await streamUI({
    model: openai('gpt-4o'),
    system: systemPrompt,
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);
      }
      return <div>{content}</div>;
    },
    tools: {
      describeMovie: {
        description: 'Get movie data based on a description of the movie eg movie about this, movie where this happens.',
        parameters: z.object({
          query: z.string().describe('The description of the movie.'),
        }),
        generate: async ({ query }) => {
          const ids = await searchVDB(query);
          const movies = await getMovieData(ids);

          history.done((messages: ServerMessage[]) => [
            ...messages,
            { role: 'assistant', content: `Here are some movies that match the description: ${query}. Would you like to know more about one of these movies?` },
          ]);

          return (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                className="mt-2 font-light pb-2"
              >
                {`Here are some movies that match the description: **${query}**. Would you like to know more about one of these movies?`}
              </ReactMarkdown>
              <MovieCardMd movies={movies}/>
            </>
          );
        },
      },
      searchMovies: {
        description: 'Search for movies based on titles, keywords, date range, cast, and crew. eg Batman, movies between 2020 and 2024, movies with cast member Tom Hanks and crew member Steven Spielberg.',
        parameters: z.object({
          title: z.string().optional().describe('Title of a movie'),
          keywords: z.array(z.string()).optional().describe('Keywords of a movie'),
          startDate: z.string().optional().describe('Date range start of movies'),
          endDate: z.string().optional().describe('Date range end of movies'),
          cast: z.array(z.string()).optional().describe('Cast of a movie'),
          crew: z.array(z.string()).optional().describe('Crew of a movie'),
        }),
        generate: async ({ title, keywords, startDate, endDate, cast, crew }) => {
          let url = `${MWAPI}/search/movies/?`;

          if (title) {
            url += `title=${encodeURIComponent(title)}`;
          }
          if (keywords && keywords.length > 0) {
            url += `&keywords=${encodeURIComponent(keywords.join(','))}`;
          }
          if (startDate && endDate) {
            url += `&date_range=${encodeURIComponent(`${startDate},${endDate}`)}`;
          }
          if (cast && cast.length > 0) {
            url += `&cast=${encodeURIComponent(cast.join(','))}`;

          }
          if (crew && crew.length > 0) {
            url += `&crew=${encodeURIComponent(crew.join(','))}`;
            
          }

          console.log(url);

          const response = await fetch(url);
          const ids = await response.json();
          const movies = await getMovieData(ids);

          // Generate a summary using the AI model
          const summaryPrompt = `Based on title ${title}, keywords ${keywords}, startDate ${startDate}, endDate ${endDate}, cast ${cast}, or crew ${crew} in one short sentence tell me what you searched for. E.g Search results for Batman:, Here are some results for Batman:, Movies that star Tom Hanks`;

          const { text: summary } = await generateText({
            model: openai('gpt-4o'),
            system: "ONE SENTENCE ONLY, BOLD NAMES TITLES KEYWORDS AND DATES",
            prompt: summaryPrompt,
          });

          history.done((messages: ServerMessage[]) => [
            ...messages,
            { role: 'assistant', content: summary },
          ]);

          return (
            <>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                className="mt-2 font-light pb-2"
              >
                {summary}
              </ReactMarkdown>
              <MovieCardMd movies={movies} />
            </>
          );
        },
      },
      getActorInfo: {
        description: 'Get information about an actor, including their image and movies. If the user inputs just a single actors name use this tool.',
        parameters: z.object({
          name: z.string().describe('The name of the actor to search for.'),
        }),
        generate: async ({ name }) => {
          const actor = await searchActor(name);
          if (!actor) {
            return <div>No actor found with that name.</div>;
          }

          const imageUrl = actor.profile_path ? await getActorImage(actor.profile_path) : null;

          // Search for movies with the actor
          const response = await fetch(`${MWAPI}/search/movies/?cast=${encodeURIComponent(actor.name)}`);
          const actorMovies = await response.json();
          const movies = await getMovieData(actorMovies);

          history.done((messages: ServerMessage[]) => [
            ...messages,
            { role: 'assistant', content: `Here's some information about ${actor.name}:` },
          ]);

          return (
            <div className="flex flex-col gap-6 mt-4">
              {/* <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                className="mt-2 font-light pb-2"
              >
                {`Here's some information about **${actor.name}**:`}
              </ReactMarkdown> */}
              <div className="flex items-start \\ gap-8">
                {imageUrl && <img src={imageUrl} width={200} alt={actor.name} className=" h-auto rounded-lg mr-6" />}
                <div className="flex flex-col gap-6 ml-6">
                  <h1 className="text-3xl font-bold mb-4">{actor.name}</h1>
                  <ul className="space-y-2">
                    <li><span className="font-semibold">Known for:</span> {actor.known_for_department}</li>
                    <li><span className="font-semibold">Popularity:</span> {actor.popularity}</li>
                    <li><span className="font-semibold">Notable works:</span> {actor.known_for.map((work: any) => work.title || work.name).join(', ')}</li>
                  </ul>
                </div>
              </div>
              <Accordion type="single" collapsible className="w-full mt-6">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-lg font-bold bg-neutral-900 rounded-2xl px-4 mb-4">Movies</AccordionTrigger>
                  <AccordionContent className="border-none pb-4">
                    <MovieCardSm movies={movies} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        },
      },
    },
  });

  return {
    id: generateId(),
    role: 'assistant',
    display: result.value,
  };
}
