import { io, type Socket } from 'socket.io-client';
import { getAccessToken } from '@/lib/auth-tokens';
import { CONVERSATION_API_BASE_URL } from '@/lib/conversation-api';

let socket: Socket | null = null;

export function getConversationSocket() {
  if (socket) {
    return socket;
  }

  const socketUrl =
    (import.meta.env.VITE_CONVERSATION_SOCKET_URL as string | undefined) ??
    CONVERSATION_API_BASE_URL.replace(/\/api\/?$/, '');

  socket = io(`${socketUrl}/conversations`, {
    transports: ['websocket'],
    auth: {
      token: getAccessToken(),
    },
  });

  return socket;
}
