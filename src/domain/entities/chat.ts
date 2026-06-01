export interface Conversation {
  id: string;
  type: string;
  name?: string;
  otherUserId?: string;
  otherUserName?: string;
  otherUserAvatarUrl?: string;
  lastMessage?: string;
  lastTime?: string;
  unread: number;
  relatedInfo?: string;
  relatedEntityId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  time: string;
  messageSeq?: number;
  seen: boolean;
}

export interface PaginatedMessages {
  items: Message[];
  nextCursor?: string;
  nextCursorSeq?: number;
  hasMore: boolean;
}

export interface PaginatedConversations {
  items: Conversation[];
  nextCursor?: string;
  hasMore: boolean;
}
