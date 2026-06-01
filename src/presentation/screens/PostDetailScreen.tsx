import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { fetchPostDetail } from "@/src/presentation/data/post-api";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import type { ComponentProps } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const POST_TOKENS = {
  radius: {
    card: 22,
    pill: 999,
    image: 18,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const primaryColor = useThemeColor({}, "tint");

  const postQuery = useQuery({
    queryKey: ["post-detail", id],
    queryFn: () => fetchPostDetail(id),
  });

  const post = postQuery.data;

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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 110, 128),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            minHeight: 56,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            style={{ width: 34, height: 34, alignItems: "center", justifyContent: "center" }}
          >
            <Feather name="chevron-left" size={20} color={textColor} />
          </Pressable>
          <Text style={{ color: textColor, fontSize: 21, fontWeight: "800" }}>Chi tiết bài viết</Text>
          <View
            style={{
              borderRadius: POST_TOKENS.radius.pill,
              backgroundColor: "rgba(255,130,80,0.12)",
              paddingHorizontal: 10,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Ionicons name="pricetag-outline" size={12} color="#ff8250" />
            <Text style={{ color: "#ff8250", fontSize: 11, fontWeight: "700", marginLeft: 5 }}>
              {post.category}
            </Text>
          </View>
        </View>

        {post.alertText ? (
          <View
            style={{
              marginTop: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,130,80,0.35)",
              backgroundColor: "rgba(255,130,80,0.08)",
              paddingHorizontal: 12,
              paddingVertical: 12,
              flexDirection: "row",
            }}
          >
            <Ionicons name="alert-circle-outline" size={16} color="#ff8250" />
            <Text style={{ color: "#ff8250", fontSize: 13, fontWeight: "600", marginLeft: 8, flex: 1 }}>
              {post.alertText}
            </Text>
          </View>
        ) : null}

        <View style={{ marginTop: 14, flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: POST_TOKENS.radius.pill,
              backgroundColor: post.urgent ? "#44b882" : "#2596d6",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>{post.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
              <Text style={{ color: textColor, fontSize: 24, fontWeight: "800" }}>{post.author}</Text>
            </View>
            <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>
              {post.time} <Text style={{ color: "#ff8c38" }}>{post.status}</Text>
            </Text>
          </View>
        </View>

        <Text style={{ color: textColor, fontSize: 16, lineHeight: 24, marginTop: 14 }}>
          {post.title}
        </Text>

        {post.imageUrl ? (
          <FastImage
            source={{ uri: post.imageUrl }}
            style={{
              width: "100%",
              height: 310,
              borderRadius: POST_TOKENS.radius.image,
              marginTop: 14,
            }}
          />
        ) : null}

        <View
          style={{
            marginTop: 12,
            borderRadius: 12,
            backgroundColor: "rgba(37,150,214,0.08)",
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="location-outline" size={16} color={mutedColor} />
          <Text style={{ color: "#3e6176", fontSize: 13, fontWeight: "600", marginLeft: 6 }}>
            {post.location}
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {post.tags.map((tag) => (
            <View
              key={tag}
              style={{
                borderRadius: POST_TOKENS.radius.pill,
                backgroundColor: "rgba(37,150,214,0.10)",
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "#2596d6", fontSize: 11, fontWeight: "700" }}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 14,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MetaItem icon="heart-outline" label={`${post.likes}`} mutedColor={mutedColor} />
          <MetaItem icon="chatbubble-outline" label={post.commentLabel} mutedColor={mutedColor} />
        </View>

        <View style={{ marginTop: 18, gap: 10 }}>
          <Text style={{ color: textColor, fontSize: 16, fontWeight: "800" }}>Bình luận mới nhất</Text>
          {post.commentsList.length === 0 ? (
            <View
              style={{
                borderRadius: POST_TOKENS.radius.card,
                backgroundColor: cardColor,
                padding: 14,
                ...POST_TOKENS.shadow,
              }}
            >
              <Text style={{ color: mutedColor, fontSize: 13 }}>Chưa có bình luận nào từ API.</Text>
            </View>
          ) : null}

          {post.commentsList.map((comment) => (
            <View
              key={comment.commentId}
              style={{
                borderRadius: POST_TOKENS.radius.card,
                backgroundColor: cardColor,
                padding: 14,
                ...POST_TOKENS.shadow,
              }}
            >
              <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>
                {comment.authorUsername ?? "Người dùng"}
              </Text>
              <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>
                {comment.createdAt ? new Date(comment.createdAt).toLocaleString("vi-VN") : "Vừa xong"}
              </Text>
              <Text style={{ color: textColor, fontSize: 13, lineHeight: 20, marginTop: 8 }}>
                {comment.content ?? ""}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 1,
          borderTopColor: borderColor,
          backgroundColor,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom + 10, 18),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: POST_TOKENS.radius.pill,
              backgroundColor: primaryColor,
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
              height: 42,
              borderRadius: POST_TOKENS.radius.pill,
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
              style={{ color: textColor, fontSize: 14, paddingVertical: 0 }}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Gửi bình luận"
            onPress={() => Alert.alert("Thông báo", "Luồng gửi bình luận chưa được nối trong app này.")}
            style={{
              marginLeft: 10,
              width: 38,
              height: 38,
              borderRadius: POST_TOKENS.radius.pill,
              backgroundColor: primaryColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="paper-plane-outline" size={18} color="white" />
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
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 18 }}>
      <Ionicons name={icon} size={18} color={mutedColor} />
      <Text style={{ color: mutedColor, fontSize: 13, marginLeft: 6 }}>{label}</Text>
    </View>
  );
}
