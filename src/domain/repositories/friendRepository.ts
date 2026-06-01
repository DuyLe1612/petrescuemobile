import { Friend, FriendRequest, PaginatedFriendRequests, PaginatedFriends } from '../entities/friend';

export interface IFriendRepository {
  getFriends(limit?: number, cursor?: string): Promise<PaginatedFriends>;
  getPendingRequests(limit?: number, cursor?: string): Promise<PaginatedFriendRequests>;
  searchUsers(query: string, limit?: number, cursor?: string): Promise<PaginatedFriends>;
  sendFriendRequest(addresseeId: string): Promise<void>;
  acceptFriendRequest(requestId: string): Promise<void>;
  declineFriendRequest(requestId: string): Promise<void>;
}
