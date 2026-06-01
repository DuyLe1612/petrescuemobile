import { ChatSocket } from "@/src/infrastructure/api/chatSocket";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    View
} from "react-native";
import { ChatListItem } from "../components/chat/ChatListItem";
import { useChats } from "../hooks/useChat";

const WS_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080")
  .replace(/^https/, "wss")
  .replace(/^http/, "ws");

export default function ChatListScreen() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isLoading } = useChats(15);
  const qc = useQueryClient();
  const socketRef = useRef<ChatSocket | null>(null);

  const items = data?.pages.flatMap((page) => page.items) || [];

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await tokenStorage.getAccessToken();
      const sock = new ChatSocket();
      socketRef.current = sock;
      sock.connect(`${WS_BASE_URL}/chat-ws`, token || "");

      sock.on("message", (ev: any) => {
        if (!mounted) return;
        if (ev.type === "conversation_update" && ev.conversationId) {
          qc.setQueryData(["chats"], (old: any) => {
            if (!old?.pages) return old;
            const updatedPages = old.pages.map((page: any, idx: number) => {
              let updatedItems = (page.items || []).map((item: any) =>
                item.id === ev.conversationId
                  ? {
                      ...item,
                      lastMessage: ev.payload?.lastMessage ?? item.lastMessage,
                      lastTime: ev.payload?.lastTime ?? item.lastTime,
                    }
                  : item,
              );
              if (idx === 0) {
                const updated = updatedItems.find(
                  (i: any) => i.id === ev.conversationId,
                );
                if (updated) {
                  updatedItems = [
                    updated,
                    ...updatedItems.filter(
                      (i: any) => i.id !== ev.conversationId,
                    ),
                  ];
                }
              }
              return { ...page, items: updatedItems };
            });
            return { ...old, pages: updatedPages };
          });
        }
      });
    })();

    return () => {
      mounted = false;
      socketRef.current?.close();
    };
  }, [qc]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0b93f6" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Feather name="message-circle" size={48} color="#cbd5e1" />
          <Text className="text-gray-500 text-center mt-4">
            Chưa có tin nhắn nào. Bấm vào biểu tượng tìm kiếm để bắt đầu trò
            chuyện.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChatListItem
              conversation={item}
              onPress={(id) => router.push(`/chat/${id}` as never)}
            />
          )}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
}
