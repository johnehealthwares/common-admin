import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type {
  ConversationInboxResponse,
  ExchangeMessage,
  ExchangeMessagesResponse,
} from '../types';
import { getConversationSocket } from '../websocket/chat-socket';
import { chatKeys } from './use-chat-queries';

export function useChatSocket(input: { conversationId?: string; participantId?: string }) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const [typingParticipantId, setTypingParticipantId] = useState<string>();

  useEffect(() => {
    const socket = getConversationSocket();

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onMessage = (message: ExchangeMessage) => {
      if (!message.conversationId) {return;}

      queryClient.setQueryData<{
        pages: ExchangeMessagesResponse[];
        pageParams: Array<string | undefined>;
      }>(chatKeys.messages(message.conversationId), (current) => {
        if (!current) {return current;}
        const exists = current.pages.some((page) =>
          page.items.some((item) => item.id === message.id)
        );
        if (exists) {return current;}

        const [firstPage, ...restPages] = current.pages;
        return {
          ...current,
          pages: [{ ...firstPage, items: [message, ...firstPage.items] }, ...restPages],
        };
      });

      queryClient.invalidateQueries({ queryKey: ['conversation-inbox'] });
    };
    const onUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['conversation-inbox'] });
    };
    const onTypingStarted = (payload: { participantId?: string }) => {
      setTypingParticipantId(payload.participantId);
    };
    const onTypingStopped = () => setTypingParticipantId(undefined);
    const onRead = (payload: { conversationId: string }) => {
      queryClient.setQueriesData<{
        pages: ConversationInboxResponse[];
        pageParams: Array<string | undefined>;
      }>({ queryKey: ['conversation-inbox'] }, (current) => {
        if (!current) {return current;}
        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.conversationId === payload.conversationId ? { ...item, unreadCount: 0 } : item
            ),
          })),
        };
      });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('conversation.message.created', onMessage);
    socket.on('conversation.updated', onUpdated);
    socket.on('conversation.read', onRead);
    socket.on('typing.started', onTypingStarted);
    socket.on('typing.stopped', onTypingStopped);

    setConnected(socket.connected);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('conversation.message.created', onMessage);
      socket.off('conversation.updated', onUpdated);
      socket.off('conversation.read', onRead);
      socket.off('typing.started', onTypingStarted);
      socket.off('typing.stopped', onTypingStopped);
    };
  }, [queryClient]);

  useEffect(() => {
    if (!input.conversationId || !input.participantId) {return;}

    const socket = getConversationSocket();
    const payload = {
      conversationId: input.conversationId,
      participantId: input.participantId,
    };
    socket.emit('conversation.opened', payload);

    return () => {
      socket.emit('conversation.closed', payload);
    };
  }, [input.conversationId, input.participantId]);

  return { connected, typingParticipantId };
}
