import {
    Friend,
    FriendRequest,
    FriendRequestStatus,
    PaginatedFriendRequests,
    PaginatedFriends,
} from "../../domain/entities/friend";
import { IFriendRepository } from "../../domain/repositories/friendRepository";
import { friendApi } from "../api/friendApi";

export class FriendRepositoryImpl implements IFriendRepository {
  async getFriends(limit?: number, cursor?: string): Promise<PaginatedFriends> {
    const response = await friendApi.listFriends(limit, cursor);
    const data = response.data;

    if (!data) return { items: [], hasMore: false };

    const items: Friend[] = (data.items || []).map((item) => ({
      userId: item.userId || "",
      username: item.username,
      fullName: item.fullName,
      avatarUrl: item.avatarUrl,
    }));

    return {
      items,
      nextCursor: data.nextCursor,
      hasMore: data.hasMore || false,
    };
  }

  async getPendingRequests(
    limit?: number,
    cursor?: string,
  ): Promise<PaginatedFriendRequests> {
    const response = await friendApi.listRequests(limit, cursor);
    const data = response.data;

    if (!data) return { items: [], hasMore: false };

    const items: FriendRequest[] = (data.items || []).map((item) => ({
      id: item.id || "",
      requesterId: item.requesterId || "",
      addresseeId: item.addresseeId || "",
      status: (item.status as FriendRequestStatus) || "pending",
      createdAt: item.createdAt,
      requesterFullName: item.requesterName,
      requesterAvatarUrl: item.requesterAvatarUrl,
    }));

    return {
      items,
      nextCursor: data.nextCursor,
      hasMore: data.hasMore || false,
    };
  }

  async searchUsers(
    query: string,
    limit?: number,
    cursor?: string,
  ): Promise<PaginatedFriends> {
    const response = await friendApi.searchUsers(query, limit, cursor);
    const data = response.data;

    if (!data) return { items: [], hasMore: false };

    const items: Friend[] = (data.content || []).map((item) => ({
      userId: item.userId || "",
      username: item.username,
      fullName: item.fullName,
      avatarUrl: item.avatarUrl,
    }));

    const currentPage = data.page || 0;
    const hasMore = data.last === false;
    const nextCursor = hasMore ? String(currentPage + 1) : undefined;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async sendFriendRequest(userId: string): Promise<void> {
    await friendApi.sendFriendRequest(userId);
  }

  async acceptFriendRequest(requestId: string): Promise<void> {
    await friendApi.acceptFriendRequest(requestId);
  }

  async declineFriendRequest(requestId: string): Promise<void> {
    await friendApi.declineFriendRequest(requestId);
  }
}
