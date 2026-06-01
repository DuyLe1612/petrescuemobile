import {
    Conversation,
    Message,
    PaginatedConversations,
    PaginatedMessages,
} from "../../domain/entities/chat";
import { IChatRepository } from "../../domain/repositories/chatRepository";
import { chatApi } from "../api/chatApi";

export class ChatRepositoryImpl implements IChatRepository {
  async getConversations(
    limit?: number,
    cursor?: string,
  ): Promise<PaginatedConversations> {
    const response = await chatApi.listConversations(cursor, limit);
    const data = response.data;

    if (!data) {
      return { items: [], hasMore: false };
    }

    const items: Conversation[] = (data.items || []).map((item) => ({
      id: item.id || "",
      type: item.type || "direct",
      name: item.name,
      otherUserId: item.otherUserId,
      otherUserName: item.otherUserName,
      otherUserAvatarUrl: item.otherUserAvatarUrl,
      lastMessage: item.lastMessage,
      lastTime: item.lastTime,
      unread: item.unread || 0,
      relatedInfo: item.relatedInfo,
      relatedEntityId: item.relatedEntityId,
    }));

    return {
      items,
      nextCursor: data.nextCursor,
      hasMore: data.hasMore || false,
    };
  }

  async getMessages(
    conversationId: string,
    limit?: number,
    cursor?: string,
    cursorSeq?: number,
    direction?: "before" | "after",
  ): Promise<PaginatedMessages> {
    const response = await chatApi.listMessages(
      conversationId,
      cursor,
      cursorSeq,
      direction,
      limit ?? 50,
    );
    const data = response.data;

    if (!data) {
      return { items: [], hasMore: false };
    }

    const items: Message[] = (data.items || []).map((item) => ({
      id: item.id || "",
      senderId: item.senderId || "",
      content: item.content || "",
      time: item.time || new Date().toISOString(),
      messageSeq: item.messageSeq,
      seen: item.seen || false,
    }));

    return {
      items,
      nextCursor: data.nextCursor,
      nextCursorSeq: data.nextCursorSeq,
      hasMore: data.hasMore || false,
    };
  }

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const item = await chatApi.sendMessage(conversationId, content);
    return {
      id: item.id || "",
      senderId: item.senderId || "",
      content: item.content || "",
      time: item.time || new Date().toISOString(),
      messageSeq: item.messageSeq,
      seen: item.seen || false,
    };
  }
}
