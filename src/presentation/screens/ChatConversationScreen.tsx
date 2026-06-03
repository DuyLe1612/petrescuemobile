import { HeaderBar } from "@/components/ui/header-bar";
import { chatApi } from "@/src/infrastructure/api/chat-api";
import { ChatSocket } from "@/src/infrastructure/api/chatSocket";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMessages, useSendMessage } from "../hooks/useChat";
import { formatChatClock } from "../utils/chat-time";

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
          if (status === "online" || status === "offline") {
            setPresenceStatus(status);
          }
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
  }, [conversationId, qc]);

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
    return "Unknown";
  }, [presenceStatus]);

  const composerBottom = Math.max(0, keyboardHeight - insets.bottom);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <HeaderBar
        title={(params.name as string) || "Chat"}
        subtitle={presenceStatus === "online" ? "Dang hoat dong" : "Trong cuoc tro chuyen"}
        onBack={() => router.back()}
        rightSlot={
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
            <Text
              style={[
                styles.badgeText,
                presenceStatus === "online"
                  ? styles.badgeTextOnline
                  : styles.badgeTextOffline,
              ]}
            >
              {presenceLabel}
            </Text>
          </View>
        }
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(m) => m.id}
        inverted
        contentContainerStyle={styles.messagesContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Feather name="message-circle" size={28} color="#6f8799" />
            </View>
            <Text style={styles.emptyTitle}>Chua co tin nhan</Text>
            <Text style={styles.emptyText}>
              Hay gui loi chao dau tien de bat dau cuoc tro chuyen.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isMe = !!item.isMine;
          return (
            <View
              style={[
                styles.messageRow,
                isMe ? styles.messageRowRight : styles.messageRowLeft,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isMe ? styles.messageBubbleRight : styles.messageBubbleLeft,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isMe ? styles.messageTextRight : styles.messageTextLeft,
                  ]}
                >
                  {item.content}
                </Text>
                {!!item.time ? (
                  <Text
                    style={[
                      styles.meta,
                      isMe ? styles.metaRight : styles.metaLeft,
                    ]}
                  >
                    {formatChatClock(item.time)}
                  </Text>
                ) : null}
              </View>
            </View>
          );
        }}
      />

      {remoteTyping ? (
        <View style={styles.typingWrap}>
          <View style={styles.typingRow}>
            <View style={styles.typingDots}>
              <View style={[styles.typingDot, { opacity: 0.4 }]} />
              <View style={[styles.typingDot, { opacity: 0.7 }]} />
              <View style={styles.typingDot} />
            </View>
            <Text style={styles.typingText}>dang nhap...</Text>
          </View>
        </View>
      ) : null}

      <View
        style={[
          styles.composerWrap,
          {
            paddingBottom: composerBottom + insets.bottom + 8,
          },
        ]}
      >
        <View style={styles.composer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={text}
            onChangeText={(t) => {
              setText(t);
              socketRef.current?.sendTyping(conversationId, t.length > 0);
            }}
            placeholder="Nhap tin nhan..."
            placeholderTextColor="#90a0ad"
            multiline
            maxLength={2000}
            returnKeyType="default"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !text.trim() && styles.sendButtonDisabled,
            ]}
            onPress={send}
            disabled={!text.trim()}
            activeOpacity={0.8}
          >
            <Ionicons name="paper-plane" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef3f8",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeOnline: {
    backgroundColor: "rgba(64, 197, 120, 0.18)",
  },
  badgeOffline: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotOnline: {
    backgroundColor: "#33b864",
  },
  dotOffline: {
    backgroundColor: "#d5dde4",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
  },
  badgeTextOnline: {
    color: "#dff7e7",
  },
  badgeTextOffline: {
    color: "#ffffff",
  },
  messagesContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 96,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#16344b",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#70818f",
  },
  messageRow: {
    width: "100%",
    marginVertical: 4,
    flexDirection: "row",
  },
  messageRowLeft: {
    justifyContent: "flex-start",
  },
  messageRowRight: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "78%",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  messageBubbleLeft: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 8,
    shadowColor: "#16344b",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  messageBubbleRight: {
    backgroundColor: "#0a4c73",
    borderTopRightRadius: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  messageTextLeft: {
    color: "#17354d",
  },
  messageTextRight: {
    color: "#ffffff",
  },
  meta: {
    marginTop: 4,
    fontSize: 10,
    textAlign: "right",
  },
  metaLeft: {
    color: "#8a98a5",
  },
  metaRight: {
    color: "rgba(255,255,255,0.72)",
  },
  typingWrap: {
    paddingHorizontal: 14,
    paddingBottom: 8,
  },
  typingRow: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#16344b",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
    marginRight: 8,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#8b9aaa",
  },
  typingText: {
    fontSize: 12,
    color: "#7a8a98",
    fontStyle: "italic",
  },
  composerWrap: {
    backgroundColor: "rgba(255,255,255,0.72)",
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 28,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe6f0",
    paddingLeft: 14,
    paddingRight: 8,
    paddingVertical: 8,
    shadowColor: "#16344b",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 2,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 12,
    fontSize: 15,
    lineHeight: 21,
    color: "#17354d",
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a4c73",
  },
  sendButtonDisabled: {
    backgroundColor: "#b8cfe0",
  },
});

function decodeJwtSubject(token: string): string | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    const base64Chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let binaryString = "";
    for (let i = 0; i < padded.length; i += 4) {
      const chunk =
        (base64Chars.indexOf(padded[i]) << 18) |
        (base64Chars.indexOf(padded[i + 1]) << 12) |
        ((padded[i + 2] === "=" ? 0 : base64Chars.indexOf(padded[i + 2])) << 6) |
        (padded[i + 3] === "=" ? 0 : base64Chars.indexOf(padded[i + 3]));
      binaryString += String.fromCharCode((chunk >> 16) & 255);
      if (padded[i + 2] !== "=") {
        binaryString += String.fromCharCode((chunk >> 8) & 255);
      }
      if (padded[i + 3] !== "=") {
        binaryString += String.fromCharCode(chunk & 255);
      }
    }
    const parsed = JSON.parse(binaryString);
    return typeof parsed?.sub === "string" ? parsed.sub : null;
  } catch (e) {
    console.warn("JWT decode error:", e);
    return null;
  }
}
