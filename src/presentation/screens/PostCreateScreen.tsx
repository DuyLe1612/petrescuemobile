import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState, useCallback } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBar } from "@/components/ui/header-bar";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import { container } from "@/src/infrastructure/di";
import { useCreatePost } from "@/src/presentation/hooks/use-post-like";
import { type LocalMediaAsset } from "@/src/domain/entities/media";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/src/infrastructure/api/generated/pet-rescue-api";

const buildInitials = (name?: string) =>
  (name ?? "PR")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "PR";

const POST_CREATE_TOKENS = {
  radius: {
    card: 24,
    pill: 999,
    input: 14,
  },
  shadow: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
} as const;

const POST_TYPES = [
  {
    id: "rescue",
    label: "Cần cứu hộ",
    icon: "medical" as const,
    activeBg: "#0a4c73",
    activeText: "#ffffff",
    surface: "rgba(10, 76, 115, 0.06)",
  },
  {
    id: "found",
    label: "Đã tìm thấy",
    icon: "search" as const,
    activeBg: "#0a4c73",
    activeText: "#ffffff",
    surface: "rgba(10, 76, 115, 0.06)",
  },
  {
    id: "lost",
    label: "Thất lạc",
    icon: "paw-outline" as const,
    activeBg: "#0a4c73",
    activeText: "#ffffff",
    surface: "rgba(10, 76, 115, 0.06)",
  },
] as const;

const SUGGESTED_TAGS = ["CứuHộ", "ThúCưngCầnGiúp", "KhẩnCấp", "HPA"] as const;

const normalizeMediaAsset = (asset: ImagePicker.ImagePickerAsset): LocalMediaAsset => ({
  uri: asset.uri,
  name: asset.fileName ?? `image-${Date.now()}.jpg`,
  type: asset.mimeType ?? "image/jpeg",
});

export default function PostCreateScreen() {
  const insets = useSafeAreaInsets();
  const [postType, setPostType] = useState<(typeof POST_TYPES)[number]["id"]>("rescue");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["CứuHộ"]);
  const [selectedImages, setSelectedImages] = useState<LocalMediaAsset[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPostMutation = useCreatePost();

  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e2e8f0", dark: "#2d2d2c" }, "icon");
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");

  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await getCurrentUser();
      return res.data;
    },
  });
  const user = userQuery.data;
  const displayName = user?.fullName || user?.username || "Người dùng";
  const initials = buildInitials(displayName);

  const canSubmit = useMemo(() => {
    return content.trim().length > 12 && !isSubmitting;
  }, [content, isSubmitting]);

  const activeType = POST_TYPES.find((item) => item.id === postType) ?? POST_TYPES[0];

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Quyền truy cập", "Cần cấp quyền truy cập thư viện ảnh để thêm ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsMultipleSelection: true,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    setSelectedImages((current) => [
      ...current,
      ...result.assets.map(normalizeMediaAsset),
    ]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setSelectedImages((current) =>
      current.filter((_, currentIndex) => currentIndex !== index),
    );
  }, []);

  const onSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      let mediaIds: string[] = [];
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map((asset) =>
          container.media.uploadMediaUseCase.execute(asset, "community-posts")
        );
        const uploadedResults = await Promise.all(uploadPromises);
        mediaIds = uploadedResults.map((item) => item.mediaId);
      }

      await createPostMutation.mutateAsync({
        content: location.trim() ? `${content}\n📍 Vị trí: ${location}` : content,
        tagCodes: selectedTags,
        mediaIds,
      });

      Alert.alert("Thành công", "Đăng bài viết mới thành công!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Lỗi", "Không thể đăng bài viết. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" />
      <HeaderBar
        title="Đăng bài mới"
        onBack={() => router.back()}
        rightSlot={
          <Pressable
            onPress={canSubmit ? onSubmit : undefined}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Đăng bài"
            style={{
              borderRadius: POST_CREATE_TOKENS.radius.pill,
              backgroundColor: canSubmit ? "#0a4c73" : "rgba(255,255,255,0.08)",
              paddingHorizontal: 16,
              paddingVertical: 7,
              minWidth: 60,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ color: canSubmit ? "white" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: "800" }}>
                Đăng
              </Text>
            )}
          </Pressable>
        }
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 24, 32),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 4 }}>
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "800", letterSpacing: 0.8 }}>
            LOẠI BÀI ĐĂNG
          </Text>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
            {POST_TYPES.map((type) => {
              const isActive = type.id === postType;

              return (
                <Pressable
                  key={type.id}
                  onPress={() => setPostType(type.id)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: POST_CREATE_TOKENS.radius.pill,
                    backgroundColor: isActive ? type.activeBg : type.surface,
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                  }}
                >
                  <Ionicons name={type.icon} size={14} color={isActive ? type.activeText : "#0a4c73"} />
                  <Text
                    style={{
                      marginLeft: 6,
                      color: isActive ? type.activeText : "#0a4c73",
                      fontSize: 12,
                      fontWeight: "800",
                    }}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Content Card */}
        <View
          style={{
            marginTop: 18,
            borderRadius: POST_CREATE_TOKENS.radius.card,
            backgroundColor: cardColor,
            padding: 16,
            borderWidth: 1,
            borderColor,
            ...POST_CREATE_TOKENS.shadow,
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
              <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>{initials}</Text>
            </View>
            <Text style={{ color: textColor, fontSize: 15, fontWeight: "800" }}>{displayName}</Text>
          </View>

          <TextInput
            multiline
            value={content}
            onChangeText={setContent}
            placeholder={
              activeType.id === "rescue"
                ? "Chia sẻ thông tin về cần cứu hộ..."
                : activeType.id === "found"
                ? "Chia sẻ thông tin thú cưng bạn vừa tìm thấy..."
                : "Chia sẻ thông tin thú cưng đang thất lạc..."
            }
            placeholderTextColor={mutedColor}
            textAlignVertical="top"
            style={{
              marginTop: 14,
              minHeight: 140,
              color: textColor,
              fontSize: 14,
              lineHeight: 22,
              paddingVertical: 0,
              fontWeight: "500",
            }}
          />

          {selectedImages.length > 0 && (
            <View style={{ marginTop: 14, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {selectedImages.map((image, index) => (
                <View
                  key={`${image.uri}-${index}`}
                  style={{
                    position: "relative",
                    width: 72,
                    height: 72,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "rgba(0,0,0,0.05)",
                  }}
                >
                  <ExpoImage
                    source={{ uri: image.uri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => removeImage(index)}
                    style={{
                      position: "absolute",
                      right: 4,
                      top: 4,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "rgba(0,0,0,0.65)",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={12} color="white" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <View
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: borderColor,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <ActionPill
              icon={<Feather name="image" size={14} color="#0a4c73" />}
              label="Đính kèm ảnh"
              onPress={pickImage}
              borderColor={borderColor}
            />
          </View>
        </View>

        {/* Location Section */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: textColor, fontSize: 13, fontWeight: "800" }}>
              📍 Vị trí sự việc
            </Text>
            <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "600" }}>
              Không bắt buộc
            </Text>
          </View>

          <View
            style={{
              marginTop: 8,
              height: 48,
              borderRadius: POST_CREATE_TOKENS.radius.input,
              backgroundColor: cardColor,
              borderWidth: 1,
              borderColor,
              paddingHorizontal: 12,
              justifyContent: "center",
              ...POST_CREATE_TOKENS.shadow,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={16} color={mutedColor} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Có thể bỏ trống hoặc nhập địa chỉ của sự việc..."
                placeholderTextColor={mutedColor}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  color: textColor,
                  fontSize: 14,
                  paddingVertical: 0,
                  fontWeight: "500",
                }}
              />
            </View>
          </View>
          <Text style={{ color: mutedColor, fontSize: 11, marginTop: 8, lineHeight: 16 }}>
            Bạn vẫn có thể đăng bài mà không cần nhập vị trí.
          </Text>
        </View>

        {/* AI Suggested Tags Section */}
        <View
          style={{
            marginTop: 20,
            borderRadius: POST_CREATE_TOKENS.radius.card,
            backgroundColor: "rgba(10, 76, 115, 0.05)",
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: textColor, fontSize: 13, fontWeight: "800" }}>Nhãn gợi ý tự động</Text>
            <View
              style={{
                marginLeft: 8,
                borderRadius: POST_CREATE_TOKENS.radius.pill,
                backgroundColor: "rgba(10, 76, 115, 0.1)",
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "#0a4c73", fontSize: 9, fontWeight: "800", textTransform: "uppercase" }}>AI Tags</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {SUGGESTED_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);

              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={{
                    borderRadius: POST_CREATE_TOKENS.radius.pill,
                    backgroundColor: active ? "rgba(10, 76, 115, 0.15)" : "rgba(255,255,255,0.75)",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderColor: active ? "rgba(10, 76, 115, 0.25)" : "transparent",
                  }}
                >
                  <Text style={{ color: "#0a4c73", fontSize: 11, fontWeight: "700" }}>#{tag}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={{ color: mutedColor, fontSize: 11, lineHeight: 16, marginTop: 12, fontWeight: "500" }}>
            Các thẻ nhãn giúp bài viết của bạn được tiếp cận và phân loại chính xác hơn trên bảng tin cứu hộ.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionPill({
  icon,
  label,
  onPress,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  borderColor: string;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderRadius: POST_CREATE_TOKENS.radius.pill,
        backgroundColor: cardColor,
        borderWidth: 1,
        borderColor,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      {icon}
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "700", marginLeft: 6 }}>{label}</Text>
    </Pressable>
  );
}
