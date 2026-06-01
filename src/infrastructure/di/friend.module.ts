import { FriendUseCase } from '@/src/application/useCases/friendUseCase';
import { FriendRepositoryImpl } from '@/src/infrastructure/repositories/friendRepositoryImpl';

const friendRepository = new FriendRepositoryImpl();
const friendUseCase = new FriendUseCase(friendRepository);

export const friendModule = {
  friendUseCase,
};
