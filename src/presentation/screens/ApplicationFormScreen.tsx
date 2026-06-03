import {
  APPLICATION_TOKENS,
  SectionCaption,
  SelectionPill,
} from "@/src/presentation/components/application/ui";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBar, FormField, Input, Button, ButtonText, Card } from "@/components/ui";

const ROLE_OPTIONS = [
  { id: "volunteer", label: "Tình nguyện viên", color: "#44b882" },
  { id: "center", label: "Trung tâm", color: "#ff9f43" },
] as const;

const SCHEDULE_OPTIONS = [
  { id: "morning", label: "Buổi sáng", color: "#277f8f" },
  { id: "evening", label: "Buổi tối", color: "#ff9f43" },
  { id: "weekend", label: "Cuối tuần", color: "#44b882" },
  { id: "flexible", label: "Linh hoạt", color: "#ff6f61" },
] as const;

const SKILL_OPTIONS = [
  { id: "rescue", label: "Cứu hộ", color: "#ff6f61" },
  { id: "care", label: "Chăm sóc", color: "#44b882" },
  { id: "transport", label: "Vận chuyển", color: "#277f8f" },
  { id: "media", label: "Truyền thông", color: "#ff9f43" },
] as const;

export default function ApplicationFormScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primaryColor = useThemeColor({}, "tint");

  const [role, setRole] = useState<(typeof ROLE_OPTIONS)[number]["id"]>("center");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>(["weekend"]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["care", "media"]);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && contact.trim().length > 0 && phone.trim().length > 0,
    [contact, name, phone],
  );

  const toggleSelection = (value: string, current: string[], setState: (items: string[]) => void) => {
    setState(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

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
      <HeaderBar
        title="Hồ sơ ứng tuyển"
        subtitle="Chỉ tạo UI, chưa gửi dữ liệu lên server"
        onBack={() => router.back()}
        rightSlot={
          <Pressable
            onPress={canSubmit ? () => router.push("/application/success" as never) : undefined}
            style={{
              borderRadius: APPLICATION_TOKENS.radius.pill,
              backgroundColor: canSubmit ? "rgba(39,127,143,0.12)" : "rgba(170,170,170,0.14)",
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Text style={{ color: canSubmit ? primaryColor : mutedColor, fontSize: 11, fontWeight: "700" }}>
              Lưu
            </Text>
          </Pressable>
        }
      />

      <View
        style={{
          marginTop: 14,
          borderRadius: APPLICATION_TOKENS.radius.hero,
          backgroundColor: primaryColor,
          paddingHorizontal: 18,
          paddingTop: 18,
          paddingBottom: 18,
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 12, fontWeight: "700" }}>
          PAW HOME Onboarding
        </Text>
        <Text style={{ color: "white", fontSize: 22, fontWeight: "800", marginTop: 6 }}>
          Điền hồ sơ phù hợp với vai trò của bạn
        </Text>
      </View>

      <Card className="mt-[14px] items-center">
        <View
          style={{
            width: 74,
            height: 74,
            borderRadius: APPLICATION_TOKENS.radius.pill,
            backgroundColor: "rgba(39,127,143,0.08)",
            borderWidth: 1,
            borderColor: "rgba(39,127,143,0.18)",
            borderStyle: "dashed",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="camera-outline" size={24} color={primaryColor} />
        </View>
        <Text style={{ color: textColor, fontSize: 13, fontWeight: "700", marginTop: 10 }}>
          Tải ảnh đại diện / logo
        </Text>
      </Card>

      <SectionCaption label="THÔNG TIN CƠ BẢN" />
      <Card className="mt-1 gap-y-4">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {ROLE_OPTIONS.map((item) => (
            <SelectionPill
              key={item.id}
              label={item.label}
              selected={item.id === role}
              color={item.color}
              onPress={() => setRole(item.id)}
            />
          ))}
        </View>

        <FormField
          label={role === "center" ? "Tên trung tâm / đội nhóm" : "Họ và tên"}
          required
        >
          <Input
            value={name}
            onChangeText={setName}
            placeholder={role === "center" ? "Ví dụ: PAW HOME Rescue Team" : "Ví dụ: Nguyễn Văn An"}
            left={<Ionicons name="person-outline" size={16} color={mutedColor} />}
          />
        </FormField>

        <FormField
          label={role === "center" ? "Người liên hệ" : "Tên liên hệ khẩn cấp"}
          required
        >
          <Input
            value={contact}
            onChangeText={setContact}
            placeholder="Ví dụ: Nguyễn Hà Linh"
            left={<Ionicons name="people-outline" size={16} color={mutedColor} />}
          />
        </FormField>

        <FormField label="Số điện thoại" required>
          <Input
            value={phone}
            onChangeText={setPhone}
            placeholder="0123 456 789"
            keyboardType="phone-pad"
            left={<Ionicons name="call-outline" size={16} color={mutedColor} />}
          />
        </FormField>

        <FormField label="Email">
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            left={<Ionicons name="mail-outline" size={16} color={mutedColor} />}
          />
        </FormField>

        <FormField label="Khu vực hỗ trợ" required>
          <Input
            value={area}
            onChangeText={setArea}
            placeholder="Ví dụ: Hà Nội, Đống Đa"
            left={<Ionicons name="location-outline" size={16} color={mutedColor} />}
          />
        </FormField>

        <FormField label="Mô tả ngắn">
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Chia sẻ kinh nghiệm, nguồn lực hoặc lý do bạn muốn đồng hành..."
            multiline
            numberOfLines={4}
            containerClassName="align-top py-2 min-h-[96px]"
            style={{ textAlignVertical: "top" }}
          />
        </FormField>
      </Card>

      <SectionCaption label="LỊCH HỖ TRỢ" />
      <Card className="mt-1">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {SCHEDULE_OPTIONS.map((item) => (
            <SelectionPill
              key={item.id}
              label={item.label}
              selected={selectedSchedule.includes(item.id)}
              color={item.color}
              onPress={() => toggleSelection(item.id, selectedSchedule, setSelectedSchedule)}
            />
          ))}
        </View>
      </Card>

      <SectionCaption label="THẾ MẠNH NỔI BẬT" />
      <Card className="mt-1 gap-y-4">
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {SKILL_OPTIONS.map((item) => (
            <SelectionPill
              key={item.id}
              label={item.label}
              selected={selectedSkills.includes(item.id)}
              color={item.color}
              onPress={() => toggleSelection(item.id, selectedSkills, setSelectedSkills)}
            />
          ))}
        </View>

        <View
          style={{
            borderRadius: APPLICATION_TOKENS.radius.field,
            backgroundColor: "rgba(39,127,143,0.08)",
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="card-outline" size={18} color={primaryColor} />
          <Text style={{ color: textColor, fontSize: 12, fontWeight: "700", marginLeft: 10 }}>
            Tải giấy tờ xác minh
          </Text>
          <Text style={{ color: mutedColor, fontSize: 11, marginLeft: "auto" }}>UI upload</Text>
        </View>
      </Card>

      <View style={{ marginTop: 16 }}>
        <Button
          variant="solid"
          size="xl"
          action="primary"
          disabled={!canSubmit}
          onPress={() => router.push("/application/success" as never)}
          className="rounded-2xl h-12"
        >
          <ButtonText className="font-extrabold text-sm">Gửi đơn đăng ký</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
}
