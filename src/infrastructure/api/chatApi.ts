import { 
  listConversations, 
  listMessages, 
  sendMessage as generatedSendMessage
} from './generated/pet-rescue-api';
import { 
  ApiResponseConversationCursorResponseDto, 
  ApiResponseChatMessageCursorResponseDto, 
  ChatMessageDto 
} from './generated/model';

/**
 * REAL API Client wrapper
 */
export const chatApi = {
  listConversations: async (limit?: number, cursor?: string): Promise<ApiResponseConversationCursorResponseDto> => {
    return listConversations({ pageSize: limit, cursor });
  },
  
  listMessages: async (
    conversationId: string,
    limit?: number,
    cursor?: string,
    cursorSeq?: number,
    direction?: string,
  ): Promise<ApiResponseChatMessageCursorResponseDto> => {
    return listMessages(conversationId, { pageSize: limit, cursor, cursorSeq, direction });
  },
  
  sendMessage: async (conversationId: string, content: string): Promise<ChatMessageDto> => {
    // Assuming the generated API returns ApiResponseChatMessageDto or similar
    const res = await generatedSendMessage(conversationId, { content });
    // Handle if the generated function returns the ApiResponse envelope
    return (res as any).data || res;
  }
};
