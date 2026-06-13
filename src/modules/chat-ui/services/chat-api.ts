import { conversationApi } from '@/lib/conversation-api';
import type { ConversationInboxResponse, ExchangeMessagesResponse } from '../types';

type InboxParams = {
  cursor?: string;
  search?: string;
  channelId?: string;
  participantId?: string;
  status?: string;
  activeOnly?: boolean;
};

export async function fetchConversationInbox(params: InboxParams) {
  const response = await conversationApi.get<ConversationInboxResponse>('/conversations/inbox', {
    params: {
      limit: 30,
      activeOnly: true,
      ...params,
    },
  });

  return response.data;
}

export async function fetchConversationMessages(input: {
  conversationId: string;
  cursor?: string;
}) {
  const response = await conversationApi.get<ExchangeMessagesResponse>('/exchanges', {
    params: {
      conversationId: input.conversationId,
      limit: 30,
      cursor: input.cursor,
    },
  });

  return response.data;
}

export async function sendConversationMessage(input: {
  conversationId: string;
  channelId: string;
  senderPhone: string;
  text: string;
}) {
  await conversationApi.post('/webhooks/mock', {
    channelId: input.channelId,
    senderPhone: input.senderPhone,
    text: input.text,
    conversationId: input.conversationId,
  });
}

export async function markConversationRead(input: {
  conversationId: string;
  participantId?: string;
}) {
  await conversationApi.post(`/conversations/${input.conversationId}/read`, {
    participantId: input.participantId,
  });
}
