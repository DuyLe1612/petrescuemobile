export interface Friend {
  userId: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

export type FriendRequestStatus = "pending" | "accepted" | "declined";

export interface FriendRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: string; // The generated DTO just uses string, we map it.
  createdAt?: string;
  
  // Custom fields we might enrich from the UI layer or aggregate
  requesterAvatarUrl?: string;
  requesterFullName?: string;
}

export interface PaginatedFriends {
  items: Friend[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface PaginatedFriendRequests {
  items: FriendRequest[];
  nextCursor?: string;
  hasMore: boolean;
}
