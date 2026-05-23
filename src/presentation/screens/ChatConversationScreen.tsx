import { chatApi } from "@/src/infrastructure/api/chat-api";
import { ChatSocket } from "@/src/infrastructure/api/chatSocket";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ChatConversationScreen({ route }: any) {
  const conversationId = route?.params?.id || route?.id;
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

  const messagesQ = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () =>
      chatApi.listMessages(conversationId, 0, 50).then((r) => r.data),
    enabled: !!conversationId,
  });

  useEffect(() => {
    setMessages(
      (messagesQ.data || []).map((item: any) => ({
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
    let mounted = true;
    (async () => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        const subject = decodeJwtSubject(token);
        setCurrentUserId(subject);
      }
      const sock = new ChatSocket();
      socketRef.current = sock;
      const apiBase =
        process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
      sock.connect(`${apiBase}/chat-ws`, token || "");
      sock.on("open", () => {
        sock.send({ type: "presence", conversationId, content: "online" });
      });
      sock.on("message", (ev: any) => {
        if (!mounted) return;
        if (ev.type === "message" && ev.conversationId === conversationId) {
          setMessages((prev) => {
            const next = [
              ...prev,
              {
                ...ev.payload,
                isMine: currentUserIdRef.current
                  ? ev.payload.senderId === currentUserIdRef.current
                  : false,
              },
            ];
            return next;
          });
          chatApi.markRead(conversationId).catch(() => {});
        }
        if (ev.type === "typing" && ev.conversationId === conversationId) {
          const typing = ev.payload?.typing === true;
          setRemoteTyping(typing);
          if (typing) {
            // clear after a timeout
            setTimeout(() => setRemoteTyping(false), 3000);
          }
        }
        if (ev.type === "presence") {
          const status = ev.payload?.status;
          if (status === "online" || status === "offline") {
            setPresenceStatus(status);
          }
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
    if (!text) return;
    try {
      await chatApi.sendMessage(conversationId, text);
      setText("");
      setRemoteTyping(false);
      socketRef.current?.sendTyping(conversationId, false);
      chatApi.markRead(conversationId).catch(() => {});
      // refetch messages
      qc.invalidateQueries({ queryKey: ["messages", conversationId] });
    } catch (e) {
      console.warn(e);
    }
  };

  const presenceLabel = useMemo(() => {
    if (presenceStatus === "online") return "Online";
    if (presenceStatus === "offline") return "Offline";
    return "";
  }, [presenceStatus]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chat</Text>
          <Text style={styles.headerSubtitle}>
            {presenceLabel || "Active conversation"}
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

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
        renderItem={({ item }) => {
          const isMe = !!item.isMine;
          return (
            <View
              style={[
                styles.bubble,
                isMe ? styles.bubbleRight : styles.bubbleLeft,
              ]}
            >
              <Text style={{ color: isMe ? "#fff" : "#111" }}>
                {item.content}
              </Text>
              {!!item.time && (
                <Text
                  style={[
                    styles.meta,
                    { color: isMe ? "rgba(255,255,255,0.8)" : "#888" },
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

      {remoteTyping && <Text style={styles.typing}>Typing…</Text>}

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={(t) => {
            setText(t);
            socketRef.current?.sendTyping(conversationId, t.length > 0);
          }}
        />
        <Button title="Send" onPress={send} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bubble: { padding: 10, margin: 8, borderRadius: 16, maxWidth: "75%" },
  bubbleLeft: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
    borderTopLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: "#0b93f6",
    alignSelf: "flex-end",
    borderTopRightRadius: 4,
  },
  composer: { flexDirection: "row", padding: 8, alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  typing: { padding: 8, color: "#666", fontStyle: "italic" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  headerSubtitle: { fontSize: 12, color: "#777", marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeOnline: { backgroundColor: "#e9f9ef" },
  badgeOffline: { backgroundColor: "#f4f4f4" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  dotOnline: { backgroundColor: "#28a745" },
  dotOffline: { backgroundColor: "#999" },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#111" },
  meta: { fontSize: 11, marginTop: 4 },
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
