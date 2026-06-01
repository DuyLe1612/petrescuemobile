import {
  APPLICATION_TOKENS,
  ApplicationPanel,
  ApplicationTopBar,
  PrimaryButton,
  SecondaryButton,
} from "@/src/presentation/components/application/ui";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ApplicationSuccessScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

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
      <ApplicationTopBar title="Kết quả đăng ký" subtitle="Hồ sơ UI đã được hoàn tất" onBack={() => router.back()} />

      <View
        style={{
          marginTop: 16,
          borderRadius: APPLICATION_TOKENS.radius.hero,
          backgroundColor: primaryColor,
          paddingTop: 64,
          paddingBottom: 28,
          paddingHorizontal: 18,
        }}
      >
        <ApplicationPanel style={{ marginTop: 0, alignItems: "center" }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: APPLICATION_TOKENS.radius.pill,
              backgroundColor: "rgba(39,127,143,0.10)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="check-circle" size={34} color="#44b882" />
          </View>

          <Text style={{ color: textColor, fontSize: 24, fontWeight: "800", marginTop: 16 }}>
            Đăng ký thành công!
          </Text>
          <Text style={{ color: mutedColor, fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 8 }}>
            HPA đã ghi nhận hồ sơ ứng tuyển của bạn. Bước tiếp theo chỉ là UI mô phỏng.
          </Text>

          <View
            style={{
              width: "100%",
              marginTop: 18,
              borderRadius: APPLICATION_TOKENS.radius.field,
              backgroundColor: "rgba(39,127,143,0.06)",
              paddingHorizontal: 14,
              paddingVertical: 14,
            }}
          >
            <ResultRow label="Vai trò hồ sơ" value="Trung tâm / đội nhóm" />
            <ResultRow label="Khu vực ưu tiên" value="Hà Nội, Đống Đa" />
            <ResultRow label="Trạng thái" value="Chờ đối chiếu" isLast accent="#ff9f43" />
          </View>
        </ApplicationPanel>
      </View>

      <ApplicationPanel style={{ marginTop: 16 }}>
        <StepRow
          icon={<Feather name="check-circle" size={18} color="#44b882" />}
          title="Form đã lưu"
          detail="Bạn có thể mở lại giao diện này bất cứ lúc nào trong luồng demo."
        />
        <StepRow
          icon={<MaterialCommunityIcons name="progress-clock" size={18} color="#ff9f43" />}
          title="Hồ sơ đang được xem xét"
          detail="Trong phiên bản thật, đội ngũ sẽ phản hồi sau khi kiểm tra thông tin."
        />
        <StepRow
          icon={<Feather name="bell" size={18} color="#277f8f" />}
          title="Nhận thông báo tiếp theo"
          detail="Các training, ca cứu hộ hoặc yêu cầu bổ sung sẽ được gửi qua mục thông báo."
          isLast
        />
      </ApplicationPanel>

      <View style={{ marginTop: 16, gap: 10 }}>
        <PrimaryButton label="Về trang cá nhân" onPress={() => router.replace("/profile")} />
        <SecondaryButton label="Xem thông báo mới" onPress={() => router.push("/news")} />
      </View>

      <Text style={{ color: mutedColor, fontSize: 11, textAlign: "center", marginTop: 12 }}>
        UI only - chưa gửi dữ liệu thật tới hệ thống.
      </Text>
    </ScrollView>
  );
}

function ResultRow({
  label,
  value,
  accent,
  isLast,
}: {
  label: string;
  value: string;
  accent?: string;
  isLast?: boolean;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <View
      style={{
        paddingBottom: isLast ? 0 : 10,
        marginBottom: isLast ? 0 : 10,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
      }}
    >
      <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "700" }}>{label}</Text>
      <Text style={{ color: accent ?? textColor, fontSize: 13, fontWeight: "800", marginTop: 4 }}>{value}</Text>
    </View>
  );
}

function StepRow({
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
          width: 36,
          height: 36,
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
