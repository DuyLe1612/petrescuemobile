import {
  APPLICATION_TOKENS,
  ApplicationPanel,
  ApplicationTopBar,
  OptionCard,
  PrimaryButton,
  SectionCaption,
  SelectionPill,
  StatPill,
} from "@/src/presentation/components/application/ui";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type ReactNode, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const APPLICATION_TYPES = [
  { id: "volunteer", label: "Tình nguyện viên", color: "#44b882" },
  { id: "center", label: "Trung tâm cứu hộ", color: "#ff9f43" },
] as const;

export default function ApplicationIntroScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const [selectedType, setSelectedType] = useState<(typeof APPLICATION_TYPES)[number]["id"]>("volunteer");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{
        paddingTop: insets.top + APPLICATION_TOKENS.spacing.top,
        paddingHorizontal: APPLICATION_TOKENS.spacing.screenX,
        paddingBottom: Math.max(insets.bottom + 24, 32),
      }}
      showsVerticalScrollIndicator={false}
    >
      <ApplicationTopBar
        title="Đăng ký / Ứng tuyển"
        subtitle="Bắt đầu với hồ sơ phù hợp nhất cho bạn"
        onBack={() => router.back()}
      />

      <View
        style={{
          marginTop: 14,
          borderRadius: APPLICATION_TOKENS.radius.hero,
          backgroundColor: primaryColor,
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 86,
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: "700" }}>
          THAM GIA CÙNG HPA
        </Text>
        <Text style={{ color: "white", fontSize: 26, fontWeight: "800", marginTop: 6 }}>
          Cộng đồng tử tế cho thú cưng
        </Text>
        <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, lineHeight: 20, marginTop: 10 }}>
          Chọn vai trò phù hợp để hỗ trợ cứu hộ, chăm sóc và lan tỏa các ca cần giúp đỡ.
        </Text>
      </View>

      <View
        style={{
          marginTop: -56,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <StatPill value="12" label="Đang tuyển" accent="#ff9f43" />
        <StatPill value="66" label="TNV hoạt động" accent="#44b882" />
        <StatPill value="320" label="Hồ sơ quan tâm" accent="#ff6f61" />
      </View>

      <SectionCaption label="CHỌN HÌNH THỨC" />
      <ApplicationPanel>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {APPLICATION_TYPES.map((item) => (
            <SelectionPill
              key={item.id}
              label={item.label}
              color={item.color}
              selected={item.id === selectedType}
              onPress={() => setSelectedType(item.id)}
            />
          ))}
        </View>

        <View style={{ marginTop: 14, gap: 12 }}>
          <OptionCard
            title="Đăng ký TNV"
            description="Dành cho cá nhân muốn cứu hộ, chăm sóc, vận chuyển hoặc hỗ trợ truyền thông."
            accent="#44b882"
            selected={selectedType === "volunteer"}
            onPress={() => setSelectedType("volunteer")}
            icon={<Feather name="shield" size={18} color="#44b882" />}
          />
          <OptionCard
            title="Ứng tuyển trung tâm"
            description="Dành cho đội nhóm hoặc cơ sở có thể tiếp nhận, chăm sóc và phối hợp cùng HPA."
            accent="#ff9f43"
            selected={selectedType === "center"}
            onPress={() => setSelectedType("center")}
            icon={<MaterialCommunityIcons name="home-group-plus" size={20} color="#ff9f43" />}
          />
        </View>
      </ApplicationPanel>

      <SectionCaption label="LỘ TRÌNH" />
      <ApplicationPanel>
        <ProgressRow
          icon={<Ionicons name="document-text-outline" size={18} color="#ff9f43" />}
          title="Điền form cơ bản"
          detail="Thông tin liên hệ, khu vực hỗ trợ và mô tả ngắn về kinh nghiệm."
        />
        <ProgressRow
          icon={<Feather name="check-circle" size={18} color="#44b882" />}
          title="Đối chiếu hồ sơ"
          detail="Đội ngũ HPA rà soát thông tin và gắn nhãn ưu tiên phù hợp."
        />
        <ProgressRow
          icon={<MaterialCommunityIcons name="hand-heart-outline" size={20} color="#277f8f" />}
          title="Kết nối hoạt động"
          detail="Bạn sẽ nhận thông báo về ca cứu hộ, training hoặc điểm tiếp nhận gần nhất."
          isLast
        />
      </ApplicationPanel>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton
          label={selectedType === "volunteer" ? "Bắt đầu đăng ký" : "Điền hồ sơ trung tâm"}
          onPress={() => router.push("/application/form" as never)}
        />
      </View>

      <Pressable onPress={() => router.push("/news")} style={{ marginTop: 12, alignItems: "center" }}>
        <Text style={{ color: mutedColor, fontSize: 12, fontWeight: "700" }}>
          Xem thông báo tuyển mới
        </Text>
      </Pressable>
    </ScrollView>
  );
}

function ProgressRow({
  icon,
  title,
  detail,
  isLast,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
  isLast?: boolean;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        paddingBottom: isLast ? 0 : 14,
        marginBottom: isLast ? 0 : 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: APPLICATION_TOKENS.radius.field,
          backgroundColor: "rgba(39,127,143,0.08)",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        {icon}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontSize: 14, fontWeight: "800" }}>{title}</Text>
        <Text style={{ color: mutedColor, fontSize: 12, lineHeight: 19, marginTop: 5 }}>{detail}</Text>
      </View>
    </View>
  );
}
