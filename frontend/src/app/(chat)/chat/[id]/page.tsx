import { ChatInterface } from '@/components/ai/ChatInterface2';
import { auth } from '@/lib/auth/authConfig';
import { getSession } from 'next-auth/react';

// Allow streaming responses up to 30 seconds
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const MWAPI = process.env.NEXT_PUBLIC_MWAPI;

export default async function Page(props: { params: { id: string } }) {

  const session = await auth();

  const session_id = props.params.id;

  const initialMessages = await fetch(`${MWAPI}/sessions/get_messages/?session_id=${session_id}`)
    .then(res => res.json());

  console.dir( initialMessages, {depth: 3})

  return (
    <div className="flex flex-col h-screen">
      <ChatInterface 
        className="flex-grow" 
        initialMessages={initialMessages}
        session_id={session_id} 
        chatBg="850"
        inputBg="900"
        messageBg="850"
      />
    </div>
  );
}