import {
    Message,
    PaginatedConversations,
    PaginatedMessages
} from "../entities/chat";

export interface IChatRepository {
  getConversations(
    limit?: number,
    cursor?: string,
  ): Promise<PaginatedConversations>;
  getMessages(
    conversationId: string,
    limit?: number,
    cursor?: string,
    cursorSeq?: number,
    direction?: "before" | "after",
  ): Promise<PaginatedMessages>;
  sendMessage(conversationId: string, content: string): Promise<Message>;
}
