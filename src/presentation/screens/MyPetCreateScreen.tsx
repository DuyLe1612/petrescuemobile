import {
  LabeledInput,
  MY_PET_TOKENS,
  MyPetPanel,
  MyPetTopBar,
  SectionCaption,
  SelectChip,
} from "@/src/presentation/components/my-pets/ui";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SPECIES_OPTIONS = [
  { id: "dog", label: "Chó", color: "#277f8f" },
  { id: "cat", label: "Mèo", color: "#ff9f43" },
] as const;

const GENDER_OPTIONS = [
  { id: "female", label: "Cái", color: "#44b882" },
  { id: "male", label: "Đực", color: "#ff6f61" },
] as const;

export default function MyPetCreateScreen() {
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [species, setSpecies] = useState<(typeof SPECIES_OPTIONS)[number]["id"]>("dog");
  const [gender, setGender] = useState<(typeof GENDER_OPTIONS)[number]["id"]>("female");

  const canSave = useMemo(() => name.trim().length > 0 && breed.trim().length > 0, [breed, name]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{
        paddingTop: insets.top + MY_PET_TOKENS.spacing.top,
        paddingHorizontal: MY_PET_TOKENS.spacing.screenX,
        paddingBottom: Math.max(insets.bottom + 24, 32),
      }}
      showsVerticalScrollIndicator={false}
    >
      <MyPetTopBar
        title="Thêm thú cưng"
        onBack={() => router.back()}
        backIcon="x"
        rightSlot={
          <Pressable
            onPress={canSave ? () => router.push("/my-pets/create-success") : undefined}
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

      <MyPetPanel style={{ alignItems: "center", marginTop: 12 }}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: MY_PET_TOKENS.radius.pill,
            backgroundColor: "rgba(39,127,143,0.08)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(39,127,143,0.18)",
            borderStyle: "dashed",
          }}
        >
          <Feather name="camera" size={22} color={primaryColor} />
        </View>
        <Text style={{ color: textColor, fontSize: 13, fontWeight: "700", marginTop: 10 }}>Thêm ảnh đại diện</Text>
        <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>
          Chỉ là UI, chưa kết nối upload ảnh.
        </Text>
      </MyPetPanel>

      <SectionCaption label="THÔNG TIN CƠ BẢN" />
      <MyPetPanel>
        <LabeledInput label="Tên thú cưng" required value={name} onChangeText={setName} placeholder="Ví dụ: Cà Phê" />
        <LabeledInput label="Giống" required value={breed} onChangeText={setBreed} placeholder="Ví dụ: Poodle lai" />

        <View style={{ marginTop: 12 }}>
          <Text style={{ color: textColor, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>Loài thú cưng</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {SPECIES_OPTIONS.map((item) => (
              <SelectChip
                key={item.id}
                label={item.label}
                selected={item.id === species}
                activeColor={item.color}
                onPress={() => setSpecies(item.id)}
              />
            ))}
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={{ color: textColor, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>Giới tính</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {GENDER_OPTIONS.map((item) => (
              <SelectChip
                key={item.id}
                label={item.label}
                selected={item.id === gender}
                activeColor={item.color}
                onPress={() => setGender(item.id)}
              />
            ))}
          </View>
        </View>

        <LabeledInput label="Cân nặng" value={weight} onChangeText={setWeight} placeholder="Ví dụ: 7.8 kg" />
        <LabeledInput label="Màu lông" value={color} onChangeText={setColor} placeholder="Ví dụ: Vàng kem" />
        <LabeledInput
          label="Ghi chú"
          value={description}
          onChangeText={setDescription}
          placeholder="Thêm mô tả ngắn về tình trạng của bé..."
          multiline
        />
      </MyPetPanel>
    </ScrollView>
  );
}
