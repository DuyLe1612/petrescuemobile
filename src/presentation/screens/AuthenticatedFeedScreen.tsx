import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchFeedPosts, type FeedPostViewModel } from "@/src/presentation/data/post-api";

const HOME_TOKENS = {
  radius: {
    card: 24,
    pill: 999,
  },
  shadow: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
} as const;

const FEED_FILTERS = [
  { label: "Tất cả", icon: "sparkles" as const, active: true },
  { label: "Cứu hộ", icon: "medical" as const, active: false },
  { label: "Tìm thấy", icon: "search" as const, active: false },
  { label: "Thất lạc", icon: "alert-circle" as const, active: false },
] as const;

export default function AuthenticatedFeedScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e2e8f0", dark: "#2d2d2c" }, "icon");

  const feedQuery = useQuery({
    queryKey: ["community-feed"],
    queryFn: () => fetchFeedPosts({ size: 10 }),
  });
  const posts = feedQuery.data?.items ?? [];

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <View
          style={{
            backgroundColor: "#0a4c73",
            paddingTop: insets.top + 20,
            paddingBottom: 22,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 22, marginRight: 8 }}>🐾</Text>
                <Text style={{ color: "white", fontSize: 26, fontWeight: "900", letterSpacing: -0.5 }}>
                  Cộng đồng
                </Text>
              </View>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13, marginTop: 4, fontWeight: "500" }}>
                Hanoi Pet Rescue & Adoption
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => router.push("/adoption")}
                accessibilityRole="button"
                accessibilityLabel="Tìm kiếm"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="search" size={18} color="white" />
              </Pressable>
              <Pressable
                onPress={() => router.push("/news")}
                accessibilityRole="button"
                accessibilityLabel="Thông báo"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="notifications-outline" size={18} color="white" />
                <View
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#38bdf8",
                    borderWidth: 1.5,
                    borderColor: "#0a4c73",
                  }}
                />
              </Pressable>
            </View>
          </View>

          {/* Premium Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 20 }}
          >
            {FEED_FILTERS.map((filter) => (
              <Pressable
                key={filter.label}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 999,
                  backgroundColor: filter.active ? "white" : "rgba(255, 255, 255, 0.12)",
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                }}
              >
                <Ionicons
                  name={filter.icon}
                  size={14}
                  color={filter.active ? "#0a4c73" : "white"}
                />
                <Text
                  style={{
                    marginLeft: 6,
                    color: filter.active ? "#0a4c73" : "white",
                    fontSize: 12,
                    fontWeight: "800",
                  }}
                >
                  {filter.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Feed Content */}
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 18,
          }}
        >
          <View style={{ gap: 16 }}>
            {feedQuery.isLoading ? (
              <View
                style={{
                  borderRadius: HOME_TOKENS.radius.card,
                  backgroundColor: cardColor,
                  paddingVertical: 48,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: borderColor,
                  ...HOME_TOKENS.shadow,
                }}
              >
                <ActivityIndicator color={primaryColor} />
              </View>
            ) : null}

            {!feedQuery.isLoading && posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                cardColor={cardColor}
                textColor={textColor}
                mutedColor={mutedColor}
                borderColor={borderColor}
                primaryColor={primaryColor}
              />
            ))}

            {!feedQuery.isLoading && posts.length === 0 ? (
              <View
                style={{
                  borderRadius: HOME_TOKENS.radius.card,
                  backgroundColor: cardColor,
                  paddingVertical: 32,
                  paddingHorizontal: 20,
                  borderWidth: 1,
                  borderColor: borderColor,
                  ...HOME_TOKENS.shadow,
                }}
              >
                <Text style={{ color: textColor, fontSize: 16, fontWeight: "800" }}>
                  Chưa có bài viết cộng đồng.
                </Text>
                <Text style={{ color: mutedColor, fontSize: 13, marginTop: 6, lineHeight: 18, fontWeight: "500" }}>
                  Feed sẽ hiển thị các bài viết chia sẻ từ cộng đồng khi có bài đăng mới từ hệ thống.
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Post Button */}
      <Pressable
        onPress={() => router.push("/post/create")}
        accessibilityRole="button"
        accessibilityLabel="Thêm bài post mới"
        style={{
          position: "absolute",
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#0a4c73",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0a4c73",
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        }}
      >
        <Feather name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}

import { useLikePost, useUnlikePost } from "@/src/presentation/hooks/use-post-like";

function FeedCard({
  post,
  cardColor,
  textColor,
  mutedColor,
  borderColor,
  primaryColor,
}: {
  post: FeedPostViewModel;
  cardColor: string;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  primaryColor: string;
}) {
  const likeMutation = useLikePost();
  const unlikeMutation = useUnlikePost();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
      unlikeMutation.mutate(post.id);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      likeMutation.mutate(post.id);
    }
  };

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/post/[id]", params: { id: post.id } })}
      accessibilityRole="button"
      accessibilityLabel={`Bài viết ${post.author}`}
      style={{
        borderRadius: HOME_TOKENS.radius.card,
        backgroundColor: cardColor,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: borderColor,
        ...HOME_TOKENS.shadow,
      }}
    >
      {post.urgent ? (
        <View
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "rgba(239, 68, 68, 0.12)",
          }}
        >
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 12, fontWeight: "800", marginLeft: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Khẩn cấp - Cần hỗ trợ ngay
          </Text>
        </View>
      ) : null}

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: post.urgent ? "rgba(239, 68, 68, 0.1)" : "rgba(10, 76, 115, 0.1)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ color: post.urgent ? "#ef4444" : "#0a4c73", fontSize: 14, fontWeight: "800" }}>
              {post.initials}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ color: textColor, fontSize: 16, fontWeight: "800" }}>{post.author}</Text>
              <View
                style={{
                  borderRadius: 12,
                  backgroundColor: `${post.statusColor}12`,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: `${post.statusColor}25`,
                }}
              >
                <Text style={{ color: post.statusColor, fontSize: 10, fontWeight: "800" }}>
                  {post.status}
                </Text>
              </View>
            </View>
            <Text style={{ color: mutedColor, fontSize: 12, marginTop: 3, fontWeight: "500" }}>{post.time}</Text>
          </View>
        </View>

        <Text style={{ color: textColor, fontSize: 15, lineHeight: 22, marginTop: 12, fontWeight: "500" }}>
          {post.title}
        </Text>

        {post.imageUrl ? (
          <FastImage
            source={{ uri: post.imageUrl }}
            style={{
              width: "100%",
              height: 200,
              borderRadius: 16,
              marginTop: 12,
            }}
          />
        ) : null}

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12, gap: 4 }}>
          <Ionicons name="location-outline" size={14} color={mutedColor} />
          <Text style={{ color: mutedColor, fontSize: 12, fontWeight: "500" }}>{post.location}</Text>
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
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            onPress={handleLike}
            style={{ flexDirection: "row", alignItems: "center", marginRight: 24, paddingVertical: 4, paddingHorizontal: 4 }}
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={18}
              color={liked ? "#ef4444" : mutedColor}
            />
            <Text style={{ color: liked ? "#ef4444" : mutedColor, fontSize: 13, marginLeft: 6, fontWeight: "700" }}>
              {likeCount}
            </Text>
          </Pressable>

          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 24, paddingVertical: 4 }}>
            <Ionicons name="chatbubble-outline" size={18} color={mutedColor} />
            <Text style={{ color: mutedColor, fontSize: 13, marginLeft: 6, fontWeight: "700" }}>
              {post.comments}
            </Text>
          </View>
          
          <Pressable
            onPress={() => router.push({ pathname: "/post/[id]", params: { id: post.id } })}
            style={{
              marginLeft: "auto",
              borderRadius: 14,
              backgroundColor: "#0a4c73",
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>{post.cta}</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function FeedMeta({
  icon,
  value,
  mutedColor,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: number;
  mutedColor: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 18 }}>
      <Ionicons name={icon} size={16} color={mutedColor} />
      <Text style={{ color: mutedColor, fontSize: 12, marginLeft: 6 }}>{value}</Text>
    </View>
  );
}

function circleButtonStyle(backgroundColor: string) {
  return {
    width: 34,
    height: 34,
    borderRadius: HOME_TOKENS.radius.pill,
    backgroundColor,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}

const notificationDotStyle = {
  position: "absolute" as const,
  top: 7,
  right: 8,
  width: 7,
  height: 7,
  borderRadius: HOME_TOKENS.radius.pill,
  backgroundColor: "#38bdf8",
};
