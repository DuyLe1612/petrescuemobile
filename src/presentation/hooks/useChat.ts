import { container } from "@/src/infrastructure/di/container";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

export const useChats = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["chats"],
    queryFn: ({ pageParam }) =>
      container.chat.chatUseCase.getConversations({ limit, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};

export const useMessages = (conversationId: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam }) =>
      container.chat.chatUseCase.getMessages({
        conversationId,
        limit,
        cursor: pageParam?.cursor,
        cursorSeq: pageParam?.cursorSeq,
        direction: "before",
      }),
    initialPageParam: undefined as
      | { cursor?: string; cursorSeq?: number }
      | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor
        ? { cursor: lastPage.nextCursor, cursorSeq: lastPage.nextCursorSeq }
        : undefined,
    enabled: !!conversationId,
  });
};

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      container.chat.chatUseCase.sendMessage({ conversationId, content }),
    onSuccess: () => {
      // Refresh messages
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      // Refresh chat list for lastMessage update
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
