export interface GetConversationsDto {
  limit?: number;
  cursor?: string;
}

export interface GetMessagesDto {
  conversationId: string;
  limit?: number;
  cursor?: string;
  cursorSeq?: number;
  direction?: "before" | "after";
}

export interface SendMessageDto {
  conversationId: string;
  content: string;
}
