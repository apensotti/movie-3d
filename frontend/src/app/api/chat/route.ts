import { LangChainAdapter, Message } from 'ai';
import { unstable_noStore as noStore } from 'next/cache';


// Allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

noStore();
export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  // Forward the request to your FastAPI backend
  const response = await fetch("https://www.moviewizard.com/wizapi/chat/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,  // Forward the messages directly
      email: "alexpensotti@gmail.com",  // Add email or other necessary fields
      session_id: ""  // Add the session_id if required
    }),
  });

  // Read the streaming response from FastAPI
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          break;
        }

        // Decode and send chunks to the stream
        const chunk = decoder.decode(value);
        controller.enqueue(chunk);
      }
    }
  });

  // Use LangChainAdapter to convert the stream to a data stream response
  return LangChainAdapter.toDataStreamResponse(stream);
}