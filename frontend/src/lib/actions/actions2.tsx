'use server';

import { generateId } from 'ai';
import { createStreamableUI, createStreamableValue } from 'ai/rsc';
import { OpenAI } from 'openai';
import { ReactNode } from 'react';
import { MessageTest } from '@/components/message';
import { omdb } from '@/data/types';
import MovieCardMd from '@/components/MovieCardMd';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI!;
const OMBDAPI = process.env.NEXT_PUBLIC_OMBDAPI_URL!;
const OMBDKEY = process.env.NEXT_PUBLIC_OMBDAPI_KEY!;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ClientMessage {
  id: string;
  status: ReactNode;
  text: ReactNode;
  gui: ReactNode;
}

const ASSISTANT_ID = 'asst_xxxx';
let THREAD_ID = '';
let RUN_ID = '';

const searchVDB = async (query: string) => {
    const response = await fetch(`${MWAPI}/search/?query=${encodeURIComponent(query)}&k=5`);
    if (!response.ok) throw new Error('Error fetching movie IDs');
    return response.json();
  }
  
const getMovieData = async (ids: string[]) => {
  const moviePromises = ids.map(async (id) => {
    const response = await fetch(`${OMBDAPI}?i=${id}&plot=full&apikey=${OMBDKEY}`);
    return response.json();
  });
  const movieData = await Promise.all(moviePromises);
  return movieData;
};

const MovieComponent = (props: omdb) => (
  <MovieCardMd movie={props}/>
);

export async function submitMessage(question: string): Promise<ClientMessage> {
  const status = createStreamableUI('thread.init');
  const textStream = createStreamableValue('');
  const textUIStream = createStreamableUI(
    <MessageTest textStream={textStream.value} />,
  );
  const gui = createStreamableUI();

  const runQueue = [];

  (async () => {
    if (THREAD_ID) {
      await openai.beta.threads.messages.create(THREAD_ID, {
        role: 'user',
        content: question,
      });

      const run = await openai.beta.threads.runs.create(THREAD_ID, {
        assistant_id: ASSISTANT_ID,
        stream: true,
      });

      runQueue.push({ id: generateId(), run });
    } else {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: ASSISTANT_ID,
        stream: true,
        thread: {
          messages: [{ role: 'user', content: question }],
        },
      });

      runQueue.push({ id: generateId(), run });
    }

    while (runQueue.length > 0) {
      const latestRun = runQueue.shift();

      if (latestRun) {
        for await (const delta of latestRun.run) {
          const { data, event } = delta;

          status.update(event);

          if (event === 'thread.created') {
            THREAD_ID = data.id;
          } else if (event === 'thread.run.created') {
            RUN_ID = data.id;
          } else if (event === 'thread.message.delta') {
            data.delta.content?.map((part: any) => {
              if (part.type === 'text') {
                if (part.text) {
                  textStream.append(part.text.value);
                }
              }
            });
          } else if (event === 'thread.run.requires_action') {
            if (data.required_action) {
              if (data.required_action.type === 'submit_tool_outputs') {
                const { tool_calls } = data.required_action.submit_tool_outputs;
                const tool_outputs = [];

                for (const tool_call of tool_calls) {
                  const { id: toolCallId, function: fn } = tool_call;
                  const { name, arguments: args } = fn;

                  if (name === 'search_emails') {
                    const { query, has_attachments } = JSON.parse(args);

                    gui.append(
                      <div className="flex flex-row gap-2 items-center">
                        <div>
                          Searching for emails: {query}, has_attachments:
                          {has_attachments ? 'true' : 'false'}
                        </div>
                      </div>,
                    );

                    await new Promise(resolve => setTimeout(resolve, 2000));

                    const ids = await searchVDB(query);
                    const movies = await getMovieData(ids);

                    gui.append(movies.map((movie) => <MovieComponent {...movie} />));

                    tool_outputs.push({
                      tool_call_id: toolCallId,
                      output: JSON.stringify(movies),
                    });
                  }
                }

                const nextRun: any =
                  await openai.beta.threads.runs.submitToolOutputs(
                    THREAD_ID,
                    RUN_ID,
                    {
                      tool_outputs,
                      stream: true,
                    },
                  );

                runQueue.push({ id: generateId(), run: nextRun });
              }
            }
          } else if (event === 'thread.run.failed') {
            console.log(data);
          }
        }
      }
    }

    status.done();
    textUIStream.done();
    gui.done();
  })();

  return {
    id: generateId(),
    status: status.value,
    text: textUIStream.value,
    gui: gui.value,
  };
}