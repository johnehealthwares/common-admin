import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchConversationInbox,
  fetchConversationMessages,
  markConversationRead,
  sendConversationMessage,
} from '../services/chat-api';
import type { ExchangeMessage, ExchangeMessagesResponse } from '../types';

export const chatKeys = {
  inbox: (search: string) => ['conversation-inbox', { search }] as const,
  messages: (conversationId?: string) => ['conversation-messages', conversationId] as const,
};

export function useConversationInbox(search: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.inbox(search),
    queryFn: ({ pageParam }) =>
      fetchConversationInbox({
        cursor: pageParam,
        search: search.trim() || undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useConversationMessages(conversationId?: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    enabled: Boolean(conversationId),
    queryFn: ({ pageParam }) =>
      fetchConversationMessages({
        conversationId: conversationId!,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useSendConversationMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendConversationMessage,
    onMutate: async (input) => {
      const queryKey = chatKeys.messages(input.conversationId);
      await queryClient.cancelQueries({ queryKey });
      console.log({input})
      const optimisticMessage: ExchangeMessage = {
        id: `optimistic-${Date.now()}`,
        conversationId: input.conversationId,
        senderId: input.senderPhone,
        direction: 'inbound',
        text: input.text,
        createdAt: new Date().toISOString(),
        status: 'sent',
        optimistic: true,
      };

      queryClient.setQueryData<{
        pages: ExchangeMessagesResponse[];
        pageParams: Array<string | undefined>;
      }>(queryKey, (current) => {
        if (!current) {
          return {
            pages: [{ items: [optimisticMessage] }],
            pageParams: [undefined],
          };
        }

        const [firstPage, ...restPages] = current.pages;
        return {
          ...current,
          pages: [
            {
              ...firstPage,
              items: [optimisticMessage, ...firstPage.items],
            },
            ...restPages,
          ],
        };
      });

      return { queryKey, optimisticId: optimisticMessage.id };
    },
    onError: (_error, _input, context) => {
      if (!context) return;

      queryClient.setQueryData<{
        pages: ExchangeMessagesResponse[];
        pageParams: Array<string | undefined>;
      }>(context.queryKey, (current) => {
        if (!current) return current;

        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            items: page.items.map((message) =>
              message.id === context.optimisticId
                ? { ...message, status: 'failed', optimistic: false }
                : message
            ),
          })),
        };
      });
    },
    onSuccess: (_data, input, context) => {
      // Mark the optimistic message as confirmed (no longer optimistic)
      // The mock webhook returns 201 — the real message will arrive via WebSocket
      queryClient.setQueryData<{
        pages: ExchangeMessagesResponse[];
        pageParams: Array<string | undefined>;
      }>(chatKeys.messages(input.conversationId), (current) => {
        if (!current) return current;

        return {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            items: page.items.map((message) =>
              message.id === context?.optimisticId ? { ...message, optimistic: false } : message
            ),
          })),
        };
      });

      queryClient.invalidateQueries({ queryKey: ['conversation-inbox'] });
    },
  });
}

export function useMarkConversationRead() {
  return useMutation({
    mutationFn: markConversationRead,
  });
}
