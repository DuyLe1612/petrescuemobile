import { ChatUseCase } from '@/src/application/useCases/chatUseCase';
import { ChatRepositoryImpl } from '@/src/infrastructure/repositories/chatRepositoryImpl';

const chatRepository = new ChatRepositoryImpl();
const chatUseCase = new ChatUseCase(chatRepository);

export const chatModule = {
  chatUseCase,
};
