import {
    listConversations as apiListConversations,
    listMessages as apiListMessages,
    markRead as apiMarkRead,
    sendMessage as apiSendMessage,
} from "./generated/pet-rescue-api";

export interface ConversationSummary {
  id: string;
  name?: string;
  lastMessagePreview?: string;
  lastMessageTime?: string;
  unread?: number;
}

export interface ConversationCursorResponse {
  items: ConversationSummary[];
  nextCursor?: string | null;
  hasMore: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  time: string;
  messageSeq?: number;
  seen?: boolean;
}

const normalizeConversation = (item: {
  id?: string;
  name?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
}): ConversationSummary => ({
  id: item.id ?? "",
  name: item.name,
  lastMessagePreview: item.lastMessage,
  lastMessageTime: item.lastTime,
  unread: item.unread,
});

export const chatApi = {
  listConversations: async (cursor?: string, limit = 20) => {
    const response = await apiListConversations({
      cursor,
      pageSize: limit,
    });

    return {
      data: {
        items: (response.data?.items ?? []).map(normalizeConversation),
        nextCursor: response.data?.nextCursor ?? null,
        hasMore: response.data?.hasMore ?? false,
      } as ConversationCursorResponse,
    };
  },

  listMessages: async (
    conversationId: string,
    cursor?: string,
    cursorSeq?: number,
    direction: "before" | "after" = "before",
    pageSize = 50,
  ) => {
    const response = await apiListMessages(conversationId, {
      cursor,
      cursorSeq,
      direction,
      pageSize,
    });

    return {
      data: {
        items: (response.data?.items ?? []) as ChatMessage[],
        nextCursor: response.data?.nextCursor ?? undefined,
        nextCursorSeq: response.data?.nextCursorSeq ?? undefined,
        hasMore: response.data?.hasMore ?? false,
      },
    };
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await apiSendMessage(conversationId, { content });

    return {
      data: response.data as ChatMessage,
    };
  },

  markRead: async (conversationId: string) => {
    return apiMarkRead(conversationId);
  },
};
