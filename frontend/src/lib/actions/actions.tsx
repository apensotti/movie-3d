'use server';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import MovieCardMd from '@/components/MovieCardMd';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;

const searchVDB = async (query: string) => {
  const response = await fetch(`${MWAPI}/search/?query=${encodeURIComponent(query)}&k=5`);
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

interface MovieProps {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: [{ Source: string, Value: string }];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

const MovieComponent = (props: MovieProps) => <MovieCardMd movie={props} />;

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

// Updated: Checking if the input requires a tool or just a text response
const isToolRequired = (input: string) => {
  return input.toLowerCase().includes('movie') || input.toLowerCase().includes('film');
};

export async function continueConversation(input: string): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  // If the input requires a tool (e.g., movie-related query)
  if (isToolRequired(input)) {
    const result = await streamUI({
      model: openai('gpt-4o'),
      system:
        "You are a movie assistant that can use tools to find movies based on descriptions and answer questions about those movies.",
      messages: [...history.get(), { role: 'user', content: input }],
      text: ({ content, done }) => {
        if (!done) {
          return <div>{content}</div>;
        }

        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);

        return <div>{content}</div>;
      },
      tools: {
        showMovies: {
          description: 'Get movie data based on a description given by the user.',
          parameters: z.object({
            query: z.string().describe('The description of the movie.'),
          }),
          generate: async ({ query }) => {
            history.done((messages: ServerMessage[]) => [
              ...messages,
              { role: 'assistant', content: `Showing movies that match the description: ${query}` },
            ]);

            const ids = await searchVDB(query);
            const movies = await getMovieData(ids);

            const movieComponents = movies.map((movie) => <MovieComponent {...movie} />);

            // After movies are shown, stream a follow-up question
            return (
              <>
                {movieComponents}
                <div className="mt-4">Do you have any other questions?</div>
              </>
            );
          },
        },
        getInformationAboutAMovie: {
          description: 'Get information about a movie.',
          parameters: z.object({
            title: z.string().describe('The title of the movie.'),
          }),
          generate: async ({ title }) => {
            history.done((messages: ServerMessage[]) => [
              ...messages,
              { role: 'assistant', content: `Getting information about the movie: ${title}` },
            ]);

            const response = await fetch(`${OMBDAPI}?t=${title}&plot=full&apikey=${OMBDKEY}`);
            const movie = await response.json();

            const movieComponent = <MovieComponent {...movie} />;

            // After movie info, stream a follow-up question
            return (
              <>
                {movieComponent}
                <div className="mt-4">Do you have any other questions?</div>
              </>
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
  } else {
    // If the input doesn't require a tool, just stream a general response
    const result = await streamUI({
      model: openai('gpt-4o'),
      system: "You are an assistant that can answer general questions.",
      messages: [...history.get(), { role: 'user', content: input }],
      text: ({ content, done }) => {
        if (!done) {
          return <div>{content}</div>;
        }

        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);

        return (
          <>
            <div>{content}</div>
            <div className="mt-4">Do you have any other questions?</div>
          </>
        );
      },
    });

    return {
      id: generateId(),
      role: 'assistant',
      display: result.value,
    };
  }
}
