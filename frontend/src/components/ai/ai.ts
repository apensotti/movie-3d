import { createAI } from 'ai/rsc';
import { ServerMessage, ClientMessage, continueConversation } from '@/lib/actions/actions';

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  initialAIState: [],
  initialUIState: [],
});