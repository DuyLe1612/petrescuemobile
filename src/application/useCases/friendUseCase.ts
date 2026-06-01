import { IFriendRepository } from '../../domain/repositories/friendRepository';
import { GetFriendsDto, SearchUsersDto } from '../dto/friend.dto';

export class FriendUseCase {
  constructor(private readonly friendRepository: IFriendRepository) {}

  async getFriends(dto: GetFriendsDto) {
    return this.friendRepository.getFriends(dto.limit, dto.cursor);
  }

  async getPendingRequests(dto: GetFriendsDto) {
    return this.friendRepository.getPendingRequests(dto.limit, dto.cursor);
  }

  async searchUsers(dto: SearchUsersDto) {
    if (!dto.query.trim()) {
      return { items: [], hasMore: false };
    }
    return this.friendRepository.searchUsers(dto.query, dto.limit, dto.cursor);
  }

  async sendFriendRequest(userId: string) {
    return this.friendRepository.sendFriendRequest(userId);
  }

  async acceptFriendRequest(requestId: string) {
    return this.friendRepository.acceptFriendRequest(requestId);
  }

  async declineFriendRequest(requestId: string) {
    return this.friendRepository.declineFriendRequest(requestId);
  }
}
