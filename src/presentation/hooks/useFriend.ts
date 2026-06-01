import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { container } from '@/src/infrastructure/di/container';

export const useFriends = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['friends'],
    queryFn: ({ pageParam }) => container.friend.friendUseCase.getFriends({ limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useFriendRequests = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['friendRequests'],
    queryFn: ({ pageParam }) => container.friend.friendUseCase.getPendingRequests({ limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useSearchUsers = (query: string, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['searchUsers', query],
    queryFn: ({ pageParam }) => container.friend.friendUseCase.searchUsers({ query, limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: query.trim().length > 0,
  });
};

export const useFriendActions = () => {
  const queryClient = useQueryClient();
  
  const sendRequest = useMutation({
    mutationFn: (userId: string) => container.friend.friendUseCase.sendFriendRequest(userId),
  });

  const acceptRequest = useMutation({
    mutationFn: (requestId: string) => container.friend.friendUseCase.acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });

  const declineRequest = useMutation({
    mutationFn: (requestId: string) => container.friend.friendUseCase.declineFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    }
  });

  return { sendRequest, acceptRequest, declineRequest };
};
