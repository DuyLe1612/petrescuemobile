import { ChatSocket } from "@/src/infrastructure/api/chatSocket";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { ChatListItem } from "../components/chat/ChatListItem";
import { useChats } from "../hooks/useChat";

const WS_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080")
  .replace(/^https/, "wss")
  .replace(/^http/, "ws");

export default function ChatListScreen() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isLoading, isRefetching, refetch } =
    useChats(15);
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
    <View className="flex-1 bg-[#f3f7fb]">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0a4c73" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-white">
            <Feather name="message-circle" size={36} color="#7e95a8" />
          </View>
          <Text className="text-center text-xl font-black text-[#16344b]">
            Chua co cuoc tro chuyen
          </Text>
          <Text className="mt-3 text-center text-sm leading-6 text-[#728391]">
            Khi ban bat dau nhan tin voi nguoi dung khac, danh sach hoi thoai se
            hien o day.
          </Text>
        </View>
      ) : (
        <>
          <View className="px-4 pb-3 pt-4">
            <Text className="text-[28px] font-black text-[#15334a]">
              Tin nhan
            </Text>
            <Text className="mt-1 text-sm leading-5 text-[#738492]">
              {items.length} cuoc tro chuyen gan day
            </Text>
          </View>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatListItem
                conversation={item}
                onPress={(id) => router.push(`/chat/${id}` as never)}
              />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => void refetch()}
                tintColor="#0a4c73"
              />
            }
            onEndReached={() => {
              if (hasNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.5}
          />
        </>
      )}
    </View>
  );
}
