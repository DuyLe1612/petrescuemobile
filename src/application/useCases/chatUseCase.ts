import { IChatRepository } from "../../domain/repositories/chatRepository";
import {
  GetConversationsDto,
  GetMessagesDto,
  SendMessageDto,
} from "../dto/chat.dto";

export class ChatUseCase {
  constructor(private readonly chatRepository: IChatRepository) {}

  async getConversations(dto: GetConversationsDto) {
    return this.chatRepository.getConversations(dto.limit, dto.cursor);
  }

  async getMessages(dto: GetMessagesDto) {
    if (!dto.conversationId) throw new Error("Conversation ID is required");
    return this.chatRepository.getMessages(
      dto.conversationId,
      dto.limit,
      dto.cursor,
      dto.cursorSeq,
      dto.direction,
    );
  }

  async sendMessage(dto: SendMessageDto) {
    if (!dto.content.trim()) {
      throw new Error("Message content cannot be empty");
    }
    return this.chatRepository.sendMessage(dto.conversationId, dto.content);
  }
}
