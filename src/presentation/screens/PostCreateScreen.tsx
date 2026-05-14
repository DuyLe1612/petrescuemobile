import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export default function PostCreateScreen() {
  const insets = useSafeAreaInsets();
  const [postType, setPostType] = useState<(typeof POST_TYPES)[number]["id"]>("rescue");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["CứuHộ"]);

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const primaryColor = useThemeColor({}, "tint");

  const canSubmit = useMemo(() => {
    return content.trim().length > 12 && location.trim().length > 0;
  }, [content, location]);

  const activeType = POST_TYPES.find((item) => item.id === postType) ?? POST_TYPES[0];

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const onSubmit = () => {
    Alert.alert(
      "Đăng bài mới",
      "Form đăng bài đã sẵn sàng. Bước tiếp theo là nối API tạo community post.",
      [{ text: "OK", onPress: () => router.back() }],
    );
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
            }}
          >
            <Text style={{ color: canSubmit ? primaryColor : mutedColor, fontSize: 12, fontWeight: "700" }}>
              Đăng
            </Text>
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
}: {
  icon: React.ReactNode;
  label: string;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <Pressable
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
