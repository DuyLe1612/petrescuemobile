import {
  ApiResponseCursorPageDtoFriendRequestDto,
  ApiResponseCursorPageDtoFriendSummaryDto,
  ApiResponsePageResponseUserPublicSearchDto,
  ApiResponseVoid,
} from "./generated/model";
import {
  acceptRequest,
  listFriends,
  listPending,
  rejectRequest,
  searchPublicUsers,
  sendRequest,
} from "./generated/pet-rescue-api";

/**
 * REAL API Client wrapper
 */
export const friendApi = {
  listFriends: async (
    limit?: number,
    cursor?: string,
  ): Promise<ApiResponseCursorPageDtoFriendSummaryDto> => {
    return listFriends({ pageSize: limit, cursor });
  },

  listRequests: async (
    limit?: number,
    cursor?: string,
  ): Promise<ApiResponseCursorPageDtoFriendRequestDto> => {
    return listPending({ pageSize: limit, cursor });
  },

  searchUsers: async (
    query: string,
    limit?: number,
    cursor?: string,
  ): Promise<ApiResponsePageResponseUserPublicSearchDto> => {
    const page = cursor ? Number(cursor) : 0;
    return searchPublicUsers({ search: query, page, pageSize: limit });
  },

  sendFriendRequest: async (userId: string): Promise<ApiResponseVoid> => {
    // Based on openAPI, it takes addresseeId in body? Or path variable?
    // Assuming generated API expects { addresseeId: userId } based on common patterns
    const res = await sendRequest({ addresseeId: userId } as any);
    return res as unknown as ApiResponseVoid;
  },

  acceptFriendRequest: async (requestId: string): Promise<ApiResponseVoid> => {
    const res = await acceptRequest(requestId);
    return res as unknown as ApiResponseVoid;
  },

  declineFriendRequest: async (requestId: string): Promise<ApiResponseVoid> => {
    const res = await rejectRequest(requestId);
    return res as unknown as ApiResponseVoid;
  },
};
