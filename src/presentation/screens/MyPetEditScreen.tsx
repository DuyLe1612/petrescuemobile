import {
  ChecklistRow,
  LabeledInput,
  MY_PET_TOKENS,
  MyPetPanel,
  MyPetTopBar,
  SectionCaption,
  SelectChip,
} from "@/src/presentation/components/my-pets/ui";
import { findMyPetById } from "@/src/presentation/mocks/my-pets";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEALTH_OPTIONS = [
  { id: "good", label: "Khỏe mạnh", color: "#44b882" },
  { id: "warning", label: "Đang bệnh", color: "#ff6f61" },
  { id: "recovering", label: "Hồi phục", color: "#ffb347" },
] as const;

export default function MyPetEditScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const pet = findMyPetById(id ?? "");
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  const [healthState, setHealthState] = useState<(typeof HEALTH_OPTIONS)[number]["id"]>("good");
  const [name, setName] = useState(pet?.name ?? "");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [weight, setWeight] = useState(pet?.weightLabel ?? "");
  const [color, setColor] = useState(pet?.color ?? "");
  const [location, setLocation] = useState(pet?.rescueLocation ?? "");
  const [description, setDescription] = useState(pet?.healthSummary ?? "");

  const canSave = useMemo(() => name.trim().length > 0 && breed.trim().length > 0, [breed, name]);

  if (!pet) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: "700" }}>Không tìm thấy hồ sơ thú cưng.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + MY_PET_TOKENS.spacing.top,
          paddingHorizontal: MY_PET_TOKENS.spacing.screenX,
          paddingBottom: Math.max(insets.bottom + 96, 112),
        }}
        showsVerticalScrollIndicator={false}
      >
        <MyPetTopBar
          title="Cập nhật"
          onBack={() => router.back()}
          rightSlot={
            <Pressable
              onPress={canSave ? () => router.back() : undefined}
              style={{
                borderRadius: MY_PET_TOKENS.radius.pill,
                backgroundColor: canSave ? "rgba(39,127,143,0.12)" : "rgba(170,170,170,0.14)",
                paddingHorizontal: 12,
                paddingVertical: 7,
              }}
            >
              <Text style={{ color: canSave ? primaryColor : mutedColor, fontSize: 11, fontWeight: "700" }}>
                Lưu
              </Text>
            </Pressable>
          }
        />

        <SectionCaption label="TÌNH TRẠNG HIỆN TẠI" />
        <MyPetPanel>
          <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>
            Tình trạng sức khỏe hiện tại
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {HEALTH_OPTIONS.map((item) => (
              <SelectChip
                key={item.id}
                label={item.label}
                selected={item.id === healthState}
                activeColor={item.color}
                onPress={() => setHealthState(item.id)}
              />
            ))}
          </View>
        </MyPetPanel>

        <MyPetPanel style={{ marginTop: 14 }}>
          <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Thông tin thú cưng</Text>
          <LabeledInput label="Tên thú cưng" required value={name} onChangeText={setName} placeholder="Ví dụ: Cà Phê" />
          <LabeledInput label="Giống" required value={breed} onChangeText={setBreed} placeholder="Ví dụ: Poodle lai" />
          <LabeledInput label="Cân nặng" value={weight} onChangeText={setWeight} placeholder="Ví dụ: 7.8 kg" />
          <LabeledInput label="Màu lông" value={color} onChangeText={setColor} placeholder="Ví dụ: Vàng kem" />
          <LabeledInput label="Địa điểm cứu hộ" value={location} onChangeText={setLocation} placeholder="Ví dụ: Quận 3, TP.HCM" />
          <LabeledInput
            label="Mô tả ngắn"
            value={description}
            onChangeText={setDescription}
            placeholder="Ghi chú thêm về tình trạng hiện tại..."
            multiline
          />
        </MyPetPanel>

        <MyPetPanel style={{ marginTop: 14 }}>
          <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Checklist sức khỏe</Text>
          <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>
            Chỉ là UI quản lý nội bộ, chưa lưu xuống backend.
          </Text>
          <View style={{ marginTop: 8 }}>
            {pet.checklists.map((item) => (
              <ChecklistRow key={item.id} title={item.title} detail={item.detail} tone={item.tone} />
            ))}
          </View>
        </MyPetPanel>
      </ScrollView>

      <Pressable
        onPress={() => router.back()}
        style={{
          position: "absolute",
          right: 16,
          bottom: Math.max(insets.bottom + 10, 18),
          width: 52,
          height: 52,
          borderRadius: MY_PET_TOKENS.radius.pill,
          backgroundColor: primaryColor,
          alignItems: "center",
          justifyContent: "center",
          ...MY_PET_TOKENS.shadow,
        }}
      >
        <Feather name="check" size={22} color="white" />
      </Pressable>
    </View>
  );
}
