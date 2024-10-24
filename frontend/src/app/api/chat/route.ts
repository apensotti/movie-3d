import { getMutableAIState, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { ReactNode } from 'react';
import { tool as createTool } from 'ai';
import { z } from 'zod';
import { convertToCoreMessages, generateId, generateText, streamText } from 'ai';
import MovieCardMd from '@/components/component/MovieCardMd';
import { omdb, MovieDatabase } from '@/data/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import MovieCardSm from '@/components/component/MovieCardSm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { tools } from '@/components/ai/tools';
import { unstable_noStore as noStore } from 'next/cache';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;
const TMDB = process.env.NEXT_PUBLIC_TMDB!;
const TMDBKEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const TMDBIMAGEURL = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL!;

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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

export async function POST(request: Request) {
  noStore();
  const { messages } = await request.json();

  const systemPrompt = `
    You are a movie assistant that can use tools to find movies based on descriptions and answer questions about those movies.
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
    
    describeMovie: Based on a movie description, find movies that match the description. 
    searchMovies: IF @search is in the input, USE THIS TOOL. Search for movies based on titles, keywords, date range, cast, and crew. Used for specific queries like titles, keywords, date range, cast, and crew.
    getActorInfo: If the user inputs just a single actors name use this tool.
    getMovieReview: If the user asks about movie reviews use this tool. Generate a summary of the reviews in a few paragraphs, quote sentiment and opinions.

    use a combination of tools when needed.
    `;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools,
    temperature: 0.9,
    maxSteps: 2,
    experimental_telemetry: {
      isEnabled: true,
      functionId: "stream-text",
    },
  });

  return result.toDataStreamResponse({});
}
