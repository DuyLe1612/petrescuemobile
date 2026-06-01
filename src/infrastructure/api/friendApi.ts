import { 
  listFriends, 
  listPending, 
  sendRequest, 
  reject, 
  accept 
} from './generated/pet-rescue-api';
import { 
  ApiResponseCursorPageDtoFriendSummaryDto, 
  ApiResponseCursorPageDtoFriendRequestDto, 
  ApiResponseVoid 
} from './generated/model';

/**
 * REAL API Client wrapper
 */
export const friendApi = {
  listFriends: async (limit?: number, cursor?: string): Promise<ApiResponseCursorPageDtoFriendSummaryDto> => {
    return listFriends({ limit, cursor });
  },

  listRequests: async (limit?: number, cursor?: string): Promise<ApiResponseCursorPageDtoFriendRequestDto> => {
    return listPending({ limit, cursor });
  },

  searchUsers: async (query: string, limit?: number, cursor?: string): Promise<ApiResponseCursorPageDtoFriendSummaryDto> => {
    // Nếu BE đã implement hàm search friends, gọi hàm tương ứng. Tạm thời trả về rỗng nếu chưa có
    // return searchFriends({ query, limit, cursor });
    return {
      success: true,
      status: 200,
      message: "API Search User chưa được implement từ BE",
      data: {
        items: [],
        hasMore: false,
        nextCursor: undefined
      }
    };
  },

  sendFriendRequest: async (userId: string): Promise<ApiResponseVoid> => {
    // Based on openAPI, it takes addresseeId in body? Or path variable?
    // Assuming generated API expects { addresseeId: userId } based on common patterns
    const res = await sendRequest({ addresseeId: userId } as any);
    return res as unknown as ApiResponseVoid;
  },

  acceptFriendRequest: async (requestId: string): Promise<ApiResponseVoid> => {
    const res = await accept(requestId);
    return res as unknown as ApiResponseVoid;
  },

  declineFriendRequest: async (requestId: string): Promise<ApiResponseVoid> => {
    const res = await reject(requestId);
    return res as unknown as ApiResponseVoid;
  }
};
