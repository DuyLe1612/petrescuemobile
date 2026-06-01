import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState, useCallback } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import { container } from "@/src/infrastructure/di";
import { useCreatePost } from "@/src/presentation/hooks/use-post-like";
import { type LocalMediaAsset } from "@/src/domain/entities/media";

const POST_CREATE_TOKENS = {
  radius: {
    card: 22,
    pill: 999,
    input: 16,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

const POST_TYPES = [
  {
    id: "rescue",
    label: "Cần cứu hộ",
    icon: "medical" as const,
    activeBg: "#ff6f61",
    activeText: "#ffffff",
    surface: "rgba(255,111,97,0.12)",
  },
  {
    id: "found",
    label: "Đã tìm thấy",
    icon: "search" as const,
    activeBg: "#78c99a",
    activeText: "#ffffff",
    surface: "rgba(120,201,154,0.14)",
  },
  {
    id: "lost",
    label: "Thất lạc",
    icon: "paw-outline" as const,
    activeBg: "#ffbc80",
    activeText: "#ffffff",
    surface: "rgba(255,188,128,0.16)",
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

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const primaryColor = useThemeColor({}, "tint");

  const canSubmit = useMemo(() => {
    return content.trim().length > 12 && location.trim().length > 0 && !isSubmitting;
  }, [content, location, isSubmitting]);

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
        // Upload images one by one through uploadMediaUseCase
        const uploadPromises = selectedImages.map((asset) =>
          container.media.uploadMediaUseCase.execute(asset, "community-posts")
        );
        const uploadedResults = await Promise.all(uploadPromises);
        mediaIds = uploadedResults.map((item) => item.mediaId);
      }

      await createPostMutation.mutateAsync({
        content: `${content}\n📍 Vị trí: ${location}`,
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: Math.max(insets.bottom + 24, 32),
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
            disabled={isSubmitting}
            accessibilityRole="button"
            accessibilityLabel="Đóng màn đăng bài"
            style={{ width: 34, height: 34, alignItems: "center", justifyContent: "center" }}
          >
            <Feather name="x" size={20} color={textColor} />
          </Pressable>

          <Text style={{ color: textColor, fontSize: 22, fontWeight: "800" }}>Đăng bài mới</Text>

          <Pressable
            onPress={canSubmit ? onSubmit : undefined}
            disabled={!canSubmit}
            accessibilityRole="button"
            accessibilityLabel="Đăng bài"
            style={{
              borderRadius: POST_CREATE_TOKENS.radius.pill,
              backgroundColor: canSubmit ? "rgba(39,127,143,0.12)" : "rgba(160,160,160,0.18)",
              paddingHorizontal: 12,
              paddingVertical: 7,
              minWidth: 54,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={primaryColor} />
            ) : (
              <Text style={{ color: canSubmit ? primaryColor : mutedColor, fontSize: 12, fontWeight: "700" }}>
                Đăng
              </Text>
            )}
          </Pressable>
        </View>

        <View
          style={{
            marginTop: 8,
            borderTopWidth: 1,
            borderTopColor: borderColor,
            paddingTop: 16,
          }}
        >
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "700", letterSpacing: 0.7 }}>
            LOẠI BÀI ĐĂNG
          </Text>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
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
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                  }}
                >
                  <Ionicons name={type.icon} size={13} color={isActive ? type.activeText : primaryColor} />
                  <Text
                    style={{
                      marginLeft: 6,
                      color: isActive ? type.activeText : primaryColor,
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={{
            marginTop: 16,
            borderRadius: POST_CREATE_TOKENS.radius.card,
            backgroundColor: cardColor,
            paddingHorizontal: 14,
            paddingTop: 14,
            paddingBottom: 18,
            ...POST_CREATE_TOKENS.shadow,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: POST_CREATE_TOKENS.radius.pill,
                backgroundColor: primaryColor,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>VA</Text>
            </View>
            <Text style={{ color: textColor, fontSize: 16, fontWeight: "800" }}>Nguyễn Văn An</Text>
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
              fontSize: 15,
              lineHeight: 22,
              paddingVertical: 0,
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
                      backgroundColor: "rgba(0,0,0,0.6)",
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
              icon={<Feather name="image" size={14} color={primaryColor} />}
              label="Ảnh"
              onPress={pickImage}
            />
            <ActionPill
              icon={<Ionicons name="location-outline" size={14} color={primaryColor} />}
              label="Vị trí"
            />
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>
            <Text style={{ color: "#ff6f61" }}>• </Text>
            Vị trí sự việc
          </Text>

          <View
            style={{
              marginTop: 10,
              height: 46,
              borderRadius: POST_CREATE_TOKENS.radius.input,
              backgroundColor: cardColor,
              borderWidth: 1,
              borderColor,
              paddingHorizontal: 14,
              justifyContent: "center",
              ...POST_CREATE_TOKENS.shadow,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location-outline" size={15} color={mutedColor} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Nhập địa chỉ hoặc dùng vị trí hiện tại..."
                placeholderTextColor={mutedColor}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  color: textColor,
                  fontSize: 14,
                  paddingVertical: 0,
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            borderRadius: POST_CREATE_TOKENS.radius.card,
            backgroundColor: "rgba(37,150,214,0.08)",
            paddingHorizontal: 14,
            paddingVertical: 14,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Nhãn gợi ý AI</Text>
            <View
              style={{
                marginLeft: 8,
                borderRadius: POST_CREATE_TOKENS.radius.pill,
                backgroundColor: "rgba(37,150,214,0.14)",
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ color: "#2596d6", fontSize: 10, fontWeight: "700" }}>Tự động</Text>
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
                    backgroundColor: active ? "rgba(37,150,214,0.18)" : "rgba(255,255,255,0.8)",
                    paddingHorizontal: 9,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ color: "#2596d6", fontSize: 11, fontWeight: "700" }}>#{tag}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={{ color: mutedColor, fontSize: 11, lineHeight: 16, marginTop: 12 }}>
            AI sẽ tự động phân loại và gắn thêm nhãn phù hợp sau khi đăng.
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
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

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
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "600", marginLeft: 6 }}>{label}</Text>
    </Pressable>
  );
}
