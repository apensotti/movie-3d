import { Message } from 'ai';

const MWAPI = process.env.NEXT_PUBLIC_MWAPI;

export async function getMessages(session_id: string): Promise<Message[]> {
  const response = await fetch(`${MWAPI}/sessions/get_messages/?session_id=${session_id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
}

export async function createSession(session_id: string, email: string, messages: Message[]): Promise<string> {
  const response = await fetch(`${MWAPI}/sessions/create_session/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id, email, messages }),
  });
  if (!response.ok) {
    throw new Error('Failed to create session');
  }
  const data = await response.json();
  return data.session_id;
}

export async function getUserSessions(email: string): Promise<string[]> {
  const response = await fetch(`${MWAPI}/sessions/get_user_sessions/?email=${email}`);
  if (!response.ok) {
    throw new Error('Failed to get user sessions');
  }
  return response.json();
}

export async function updateSession(session_id: string, email: string, messages: Message[]): Promise<void> {
  const response = await fetch(`${MWAPI}/sessions/update_session/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ session_id, email, messages }),
  });
  if (!response.ok) {
    throw new Error('Failed to update session');
  }
}
