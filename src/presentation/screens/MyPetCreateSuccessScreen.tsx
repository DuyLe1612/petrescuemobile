import { MY_PET_TOKENS, PrimaryButton } from "@/src/presentation/components/my-pets/ui";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPetCreateSuccessScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        paddingTop: insets.top + MY_PET_TOKENS.spacing.top,
        paddingHorizontal: 28,
        paddingBottom: Math.max(insets.bottom + 24, 32),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: MY_PET_TOKENS.radius.pill,
          backgroundColor: "rgba(95,185,92,0.12)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name="check-circle" size={34} color="#44b882" />
      </View>

      <Text style={{ color: textColor, fontSize: 24, fontWeight: "800", marginTop: 20 }}>
        Thêm thú cưng thành công!
      </Text>
      <Text
        style={{
          color: mutedColor,
          fontSize: 13,
          lineHeight: 20,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        Hồ sơ của bé đã được tạo dưới dạng UI. Bạn có thể quay lại danh sách để tiếp tục hoàn thiện chi tiết.
      </Text>

      <View style={{ width: "100%", marginTop: 28 }}>
        <PrimaryButton label="Về danh sách" onPress={() => router.replace("/my-pets/index")} />
      </View>
    </View>
  );
}
