'use server';

import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { z } from 'zod';
import { generateId } from 'ai';
import MovieCardMd from '@/components/component/MovieCardMd';
import { omdb } from '@/data/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { formatAIResponse } from '../utils';

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

const MovieComponent = (props: omdb) => <MovieCardMd movie={props} />;

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
    
    Please provide detailed and structured responses. Use clear sections and subsections when appropriate. Format your responses using markdown:
    
    - Use # for main headings
    - Use ## for subheadings
    - Use - or * for bullet points
    - Use 1. 2. 3. for numbered lists
    - Use **text** for bold and *text* for italic
    
    Ensure your responses are well-structured and easy to read.
    `;

  if (isToolRequired(input)) {
    const result = await streamUI({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: [...history.get(), { role: 'user', content: input }],
      text: ({ content, done }) => {
        if (!done) {
          const formattedContent = formatAIResponse(content);
          return <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{formattedContent}</ReactMarkdown>;
        }

        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);

        const formattedContent = formatAIResponse(content);
        return <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{formattedContent}</ReactMarkdown>;
      },
      tools: {
        showMovies: {
          description: 'Get movie data based on a description given by the user.',
          parameters: z.object({
            query: z.string().describe('The description of the movie.'),
          }),
          generate: async ({ query }) => {
            const ids = await searchVDB(query);
            const movies = await getMovieData(ids);

            const movieComponents = movies.map((movie) => <MovieComponent key={movie.imdbID} {...movie} />);

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
                {movieComponents}
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
            const response = await fetch(`${OMBDAPI}?t=${title}&plot=full&apikey=${OMBDKEY}`);
            const movie = await response.json();

            const movieComponent = <MovieComponent {...movie} />;

            history.done((messages: ServerMessage[]) => [
              ...messages,
              { role: 'assistant', content: `Here's information about the movie: ${title}` },
            ]);

            return (
              <>
                {movieComponent}
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} className="mt-4">
                  Do you have any other questions about this movie?
                </ReactMarkdown>
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
    const result = await streamUI({
      model: openai('gpt-4o'),
      system: systemPrompt,
      messages: [...history.get(), { role: 'user', content: input }],
      text: ({ content, done }) => {
        if (!done) {
          return <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>;
        }

        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content },
        ]);

        return (
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} className='font-light'>
            {content}
          </ReactMarkdown>
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
