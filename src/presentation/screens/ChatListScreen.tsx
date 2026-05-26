import { chatApi } from "@/src/infrastructure/api/chat-api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";

export default function ChatListScreen() {
  const router = useRouter();
  const q = useQuery({
    queryKey: ["conversations"],
    queryFn: () => chatApi.listConversations(undefined, 50).then((r) => r.data),
  });

  const items = q.data?.items ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/chat/${item.id}`)}
            style={{
              padding: 14,
              borderBottomWidth: 1,
              borderColor: "#f0f0f0",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#0b93f6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {(item.name || "C").slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  {item.name || "Conversation"}
                </Text>
                {!!item.lastMessageTime && (
                  <Text style={{ color: "#777", fontSize: 12 }}>
                    {new Date(item.lastMessageTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
              <Text numberOfLines={1} style={{ color: "#666", marginTop: 2 }}>
                {item.lastMessagePreview || "Say hi to start the chat."}
              </Text>
            </View>
            {typeof item.unread === "number" && item.unread > 0 && (
              <View
                style={{
                  minWidth: 22,
                  paddingHorizontal: 6,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#0b93f6",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                >
                  {item.unread}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
