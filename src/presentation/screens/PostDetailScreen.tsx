import React, { useState } from "react";
import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { fetchPostDetail } from "@/src/presentation/data/post-api";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateComment } from "@/src/presentation/hooks/use-post-like";
import { HeaderBar } from "@/components/ui/header-bar";

const POST_TOKENS = {
  radius: {
    card: 24,
    pill: 999,
    image: 18,
  },
  shadow: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
} as const;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const [commentText, setCommentText] = useState("");
  const createCommentMutation = useCreateComment();

  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e2e8f0", dark: "#2d2d2c" }, "icon");
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");

  const postQuery = useQuery({
    queryKey: ["post-detail", id],
    queryFn: () => fetchPostDetail(id),
  });

  const post = postQuery.data;

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await createCommentMutation.mutateAsync({
        postId: id,
        payload: { content: commentText.trim() },
      });
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Lỗi", "Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  if (postQuery.isLoading && !post) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <ActivityIndicator color={primaryColor} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: "700" }}>Không tìm thấy bài viết.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <HeaderBar
        title="Chi tiết bài viết"
        onBack={() => router.back()}
        rightSlot={
          <View
            style={{
              borderRadius: POST_TOKENS.radius.pill,
              backgroundColor: "rgba(255,255,255,0.15)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="pricetag-outline" size={12} color="white" />
            <Text style={{ color: "white", fontSize: 11, fontWeight: "800", marginLeft: 6 }}>
              {post.category}
            </Text>
          </View>
        }
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 110, 128),
        }}
        showsVerticalScrollIndicator={false}
      >
        {post.alertText ? (
          <View
            style={{
              marginTop: 4,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(239, 68, 68, 0.15)",
              backgroundColor: "rgba(239, 68, 68, 0.06)",
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="alert-circle-outline" size={16} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontSize: 13, fontWeight: "600", marginLeft: 8, flex: 1 }}>
              {post.alertText}
            </Text>
          </View>
        ) : null}

        {/* User profile row */}
        <View style={{ marginTop: 16, flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: post.urgent ? "rgba(239, 68, 68, 0.1)" : "rgba(10, 76, 115, 0.1)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ color: post.urgent ? "#ef4444" : "#0a4c73", fontSize: 14, fontWeight: "800" }}>{post.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: textColor, fontSize: 18, fontWeight: "900" }}>{post.author}</Text>
              <View
                style={{
                  borderRadius: 12,
                  backgroundColor: "rgba(10, 76, 115, 0.1)",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: "rgba(10, 76, 115, 0.2)",
                }}
              >
                <Text style={{ color: "#0a4c73", fontSize: 10, fontWeight: "800" }}>{post.status}</Text>
              </View>
            </View>
            <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4, fontWeight: "500" }}>
              {post.time}
            </Text>
          </View>
        </View>

        <Text style={{ color: textColor, fontSize: 16, lineHeight: 24, marginTop: 16, fontWeight: "500" }}>
          {post.title}
        </Text>

        {post.imageUrl ? (
          <FastImage
            source={{ uri: post.imageUrl }}
            style={{
              width: "100%",
              height: 260,
              borderRadius: POST_TOKENS.radius.image,
              marginTop: 14,
            }}
          />
        ) : null}

        <View
          style={{
            marginTop: 14,
            borderRadius: 12,
            backgroundColor: "rgba(10, 76, 115, 0.05)",
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="location-outline" size={16} color="#0a4c73" />
          <Text style={{ color: "#0a4c73", fontSize: 13, fontWeight: "700", marginLeft: 6 }}>
            {post.location}
          </Text>
        </View>

        {post.tags && post.tags.length > 0 ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {post.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(10, 76, 115, 0.05)",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ color: "#0a4c73", fontSize: 11, fontWeight: "700" }}>#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View
          style={{
            marginTop: 16,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MetaItem icon="heart-outline" label={`${post.likes}`} mutedColor={mutedColor} />
          <MetaItem icon="chatbubble-outline" label={post.commentLabel} mutedColor={mutedColor} />
        </View>

        {/* Comments Section */}
        <View style={{ marginTop: 20, gap: 12 }}>
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "900" }}>Bình luận mới nhất</Text>
          
          {post.commentsList.length === 0 ? (
            <View
              style={{
                borderRadius: POST_TOKENS.radius.card,
                backgroundColor: cardColor,
                padding: 16,
                borderWidth: 1,
                borderColor: borderColor,
                ...POST_TOKENS.shadow,
              }}
            >
              <Text style={{ color: mutedColor, fontSize: 13, fontWeight: "500" }}>Chưa có bình luận nào từ API.</Text>
            </View>
          ) : null}

          {post.commentsList.map((comment) => (
            <View
              key={comment.commentId}
              style={{
                borderRadius: POST_TOKENS.radius.card,
                backgroundColor: cardColor,
                padding: 16,
                borderWidth: 1,
                borderColor: borderColor,
                ...POST_TOKENS.shadow,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: textColor, fontSize: 13, fontWeight: "800" }}>
                  {comment.authorUsername ?? "Người dùng"}
                </Text>
                <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "500" }}>
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
                </Text>
              </View>
              <Text style={{ color: textColor, fontSize: 13, lineHeight: 20, marginTop: 8, fontWeight: "500" }}>
                {comment.content ?? ""}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modern Bottom Comment Bar */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          backgroundColor: backgroundColor,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom + 12, 20),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#0a4c73",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>VA</Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 44,
              borderRadius: 22,
              backgroundColor: cardColor,
              borderWidth: 1,
              borderColor,
              justifyContent: "center",
              paddingHorizontal: 14,
              ...POST_TOKENS.shadow,
            }}
          >
            <TextInput
              placeholder="Viết bình luận..."
              placeholderTextColor={mutedColor}
              value={commentText}
              onChangeText={setCommentText}
              editable={!createCommentMutation.isPending}
              style={{ color: textColor, fontSize: 14, paddingVertical: 0, fontWeight: "500" }}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gửi bình luận"
            onPress={handleSendComment}
            disabled={!commentText.trim() || createCommentMutation.isPending}
            style={{
              marginLeft: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: commentText.trim() ? "#0a4c73" : borderColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {createCommentMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="paper-plane-outline" size={18} color="white" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function MetaItem({
  icon,
  label,
  mutedColor,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  mutedColor: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 24 }}>
      <Ionicons name={icon} size={18} color={mutedColor} />
      <Text style={{ color: mutedColor, fontSize: 13, marginLeft: 6, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}
