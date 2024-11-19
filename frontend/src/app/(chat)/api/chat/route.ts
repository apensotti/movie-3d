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
import { createSession, getMessages, updateSession } from '@/app/(chat)/actions';  
import { auth } from '@/lib/auth/authConfig';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMDBAPI_URL!;
const OMBDKEY = process.env.NEXT_PUBLIC_OMDBAPI_KEY!;
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

  const session = await auth();

  const { messages, session_id } = await request.json();

  const systemPrompt = `
    You are a movie assistant that can use tools to find movies based on descriptions and answer questions about those movies.
        - keep your responses limited to a sentence.
        - DO NOT output lists.
        - after every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
    
    describeMovie: Based on a movie description, find movies that match the description. 
    searchMovies: IF @search is in the input, USE THIS TOOL. Search for movies based on titles, keywords, date range, cast, and crew. Used for specific queries like titles, keywords, date range, cast, and crew.
    getActorInfo: If the user inputs just a single actors name use this tool.
    getMovieReview: If the user asks about movie reviews use this tool. Generate a summary of the reviews in a few paragraphs, quote sentiment and opinions.

    If the question is not answered with the one tool, try another tool.

    `;
    
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools,
    temperature: 0.8,
    maxSteps: 3,
    experimental_continueSteps: true,
    async onFinish({ responseMessages }) {
      if (session && session.user && session.user.email) {
        const sessionData = {
          messages: messages,
          email: session.user.email,
          session_id: session_id
        };
        
        const messages_response = [...messages, ...responseMessages];

        try {
          if (messages.length > 1) {
            await updateSession(session_id, session.user.email, messages_response);
          } else if (messages.length === 1) {
            await createSession(session_id, session.user.email, messages_response);
          } else {
            console.log("no messages");
          }
        } catch (error) {
          console.error('Error creating session:', error);
        }
      }
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
    experimental_toolCallStreaming: true
  });

  return result.toDataStreamResponse({});
}
