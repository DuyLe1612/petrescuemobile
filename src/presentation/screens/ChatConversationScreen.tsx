import { chatApi } from "@/src/infrastructure/api/chat-api";
import { ChatSocket } from "@/src/infrastructure/api/chatSocket";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMessages, useSendMessage } from "../hooks/useChat";

// Lấy WS base URL từ env — giống http client
const WS_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080")
  .replace(/^https/, "wss")
  .replace(/^http/, "ws");

export default function ChatConversationScreen({ route }: any) {
  const params = useLocalSearchParams();
  const conversationId =
    (params.id as string) || route?.params?.id || route?.id;
  const insets = useSafeAreaInsets();

  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const socketRef = useRef<ChatSocket | null>(null);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState<
    "online" | "offline" | "unknown"
  >("unknown");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const messagesQ = useMessages(conversationId);
  const { mutateAsync: sendMessageAsync } = useSendMessage(conversationId);

  // Keyboard listener — hoạt động trên cả Android edgeToEdge lẫn iOS
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    const fetchedMessages = messagesQ.data?.pages.flatMap((p) => p.items) || [];
    setMessages(
      fetchedMessages.map((item: any) => ({
        ...item,
        isMine: currentUserId ? item.senderId === currentUserId : false,
      })),
    );
  }, [messagesQ.data, currentUserId]);

  useEffect(() => {
    currentUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (!conversationId) return;
    chatApi.markRead(conversationId).catch((e) => console.warn(e));
  }, [conversationId, messages.length]);

  // WebSocket setup — dùng WS_BASE_URL từ env
  useEffect(() => {
    if (!conversationId) return;
    let mounted = true;

    (async () => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        const subject = decodeJwtSubject(token);
        setCurrentUserId(subject);
      }

      const sock = new ChatSocket();
      socketRef.current = sock;
      sock.connect(`${WS_BASE_URL}/chat-ws`, token || "");

      sock.on("open", () => {
        sock.send({ type: "presence", conversationId, content: "online" });
      });

      sock.on("message", (ev: any) => {
        if (!mounted) return;
        if (
          (ev.type === "message" || ev.type === "ack") &&
          ev.conversationId === conversationId
        ) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === ev.payload?.id);
            if (exists) return prev;
            return [
              ...prev,
              {
                ...ev.payload,
                isMine: currentUserIdRef.current
                  ? ev.payload.senderId === currentUserIdRef.current
                  : false,
              },
            ];
          });
          chatApi.markRead(conversationId).catch(() => {});
        }
        if (ev.type === "typing" && ev.conversationId === conversationId) {
          const typing = ev.payload?.typing === true;
          setRemoteTyping(typing);
          if (typing) setTimeout(() => setRemoteTyping(false), 3000);
        }
        if (ev.type === "presence") {
          const status = ev.payload?.status;
          if (status === "online" || status === "offline")
            setPresenceStatus(status);
        }
        if (ev.type === "conversation_update" && ev.conversationId) {
          qc.setQueryData(["chats"], (old: any) => {
            if (!old?.pages) return old;
            const updatedPages = old.pages.map((page: any) => {
              const items = (page.items || []).map((item: any) =>
                item.id === ev.conversationId
                  ? {
                      ...item,
                      lastMessage: ev.payload?.lastMessage ?? item.lastMessage,
                      lastTime: ev.payload?.lastTime ?? item.lastTime,
                    }
                  : item,
              );
              return { ...page, items };
            });
            return { ...old, pages: updatedPages };
          });
        }
      });
    })();

    return () => {
      mounted = false;
      socketRef.current?.send({
        type: "presence",
        conversationId,
        content: "offline",
      });
      socketRef.current?.close();
    };
  }, [conversationId]);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId) return;
    setText("");
    socketRef.current?.sendTyping(conversationId, false);
    const tempId = `local-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: currentUserIdRef.current || "",
        content: trimmed,
        time: new Date().toISOString(),
        seen: true,
        isMine: true,
      },
    ]);
    try {
      await sendMessageAsync(trimmed);
      chatApi.markRead(conversationId).catch(() => {});
      qc.invalidateQueries({ queryKey: ["messages", conversationId] });
      qc.invalidateQueries({ queryKey: ["chats"] });
    } catch (e) {
      console.warn(e);
    }
  };

  const presenceLabel = useMemo(() => {
    if (presenceStatus === "online") return "Online";
    if (presenceStatus === "offline") return "Offline";
    return "";
  }, [presenceStatus]);

  // Padding bottom = keyboard height trừ safe area bottom (tránh double-padding trên iPhone)
  const composerBottom = Math.max(0, keyboardHeight - insets.bottom);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            {(params.name as string) || "Chat"}
          </Text>
          <Text style={styles.headerSubtitle}>
            {presenceLabel || "Đang hoạt động"}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            presenceStatus === "online"
              ? styles.badgeOnline
              : styles.badgeOffline,
          ]}
        >
          <View
            style={[
              styles.dot,
              presenceStatus === "online"
                ? styles.dotOnline
                : styles.dotOffline,
            ]}
          />
          <Text style={styles.badgeText}>{presenceLabel || "Unknown"}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m.id}
        inverted
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        renderItem={({ item }) => {
          const isMe = !!item.isMine;
          return (
            <View
              style={[
                styles.bubble,
                isMe ? styles.bubbleRight : styles.bubbleLeft,
              ]}
            >
              <Text
                style={{
                  color: isMe ? "#fff" : "#111",
                  fontSize: 15,
                  lineHeight: 21,
                }}
              >
                {item.content}
              </Text>
              {!!item.time && (
                <Text
                  style={[
                    styles.meta,
                    { color: isMe ? "rgba(255,255,255,0.7)" : "#aaa" },
                  ]}
                >
                  {new Date(item.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </View>
          );
        }}
      />

      {/* Typing indicator */}
      {remoteTyping && (
        <View style={styles.typingRow}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { opacity: 0.4 }]} />
            <View style={[styles.typingDot, { opacity: 0.7 }]} />
            <View style={styles.typingDot} />
          </View>
          <Text style={styles.typingText}>đang nhập...</Text>
        </View>
      )}

      {/* Composer — đẩy lên theo bàn phím qua paddingBottom */}
      <View
        style={[
          styles.composer,
          {
            paddingBottom: composerBottom + insets.bottom + 8,
            paddingTop: 8,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={text}
          onChangeText={(t) => {
            setText(t);
            socketRef.current?.sendTyping(conversationId, t.length > 0);
          }}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#aaa"
          multiline
          maxLength={2000}
          returnKeyType="default"
        />
        <TouchableOpacity
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          onPress={send}
          disabled={!text.trim()}
          activeOpacity={0.75}
        >
          <Feather
            name="send"
            size={19}
            color="#fff"
            style={{ marginLeft: 2 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },

  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: "#111" },
  headerSubtitle: { fontSize: 12, color: "#777", marginTop: 1 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeOnline: { backgroundColor: "#e9f9ef" },
  badgeOffline: { backgroundColor: "#f2f2f2" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 5 },
  dotOnline: { backgroundColor: "#28a745" },
  dotOffline: { backgroundColor: "#bbb" },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#111" },

  bubble: {
    maxWidth: "78%",
    marginVertical: 3,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 18,
  },
  bubbleLeft: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleRight: {
    backgroundColor: "#0b93f6",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  meta: { fontSize: 10, marginTop: 3, textAlign: "right" },

  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  typingDots: { flexDirection: "row", gap: 3, marginRight: 6 },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#999" },
  typingText: { fontSize: 12, color: "#999", fontStyle: "italic" },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ececec",
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    backgroundColor: "#f1f3f5",
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 15,
    color: "#111",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0b93f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  sendButtonDisabled: { backgroundColor: "#c2e0fb" },
});

function decodeJwtSubject(token: string): string | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json =
      typeof globalThis.atob === "function"
        ? globalThis.atob(padded)
        : (() => {
            throw new Error("atob unavailable");
          })();
    const parsed = JSON.parse(json);
    return typeof parsed?.sub === "string" ? parsed.sub : null;
  } catch {
    return null;
  }
}
