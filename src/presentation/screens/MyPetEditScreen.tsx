import {
  ChecklistRow,
  LabeledInput,
  MY_PET_TOKENS,
  MyPetPanel,
  SectionCaption,
  SelectChip,
} from "@/src/presentation/components/my-pets/ui";
import { fetchMyPetDetail, updateMyPet } from "@/src/presentation/data/pet-api";
import { UpdatePetRequestDtoHealthStatus } from "@/src/infrastructure/api/generated/model";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderBar } from "@/components/ui/header-bar";

const HEALTH_OPTIONS = [
  { id: "good", label: "Khỏe mạnh", color: "#44b882" },
  { id: "warning", label: "Đang theo dõi", color: "#ffb347" },
  { id: "recovering", label: "Cần chăm sóc", color: "#ff6f61" },
] as const;

export default function MyPetEditScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  const petQuery = useQuery({
    queryKey: ["my-pet-detail", id],
    queryFn: () => fetchMyPetDetail(id ?? ""),
    enabled: Boolean(id),
  });
  const pet = petQuery.data;

  const [healthState, setHealthState] = useState<(typeof HEALTH_OPTIONS)[number]["id"]>("good");
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!pet) return;
    setHealthState(pet.statusTone === "alert" ? "recovering" : pet.statusTone === "warning" ? "warning" : "good");
    setName(pet.name);
    setBreed(pet.breed);
    setWeight(pet.weightLabel.replace(" kg", ""));
    setColor(pet.color);
    setDescription(pet.healthSummary);
  }, [pet]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!id) return null;
      return updateMyPet(id, {
        name: name.trim(),
        breed: breed.trim(),
        color: color.trim() || undefined,
        weight: weight ? Number(weight) : undefined,
        description: description.trim() || undefined,
        healthStatus:
          healthState === "recovering"
            ? UpdatePetRequestDtoHealthStatus.SPECIAL_NEEDS
            : healthState === "warning"
            ? UpdatePetRequestDtoHealthStatus.UNDER_TREATMENT
            : UpdatePetRequestDtoHealthStatus.HEALTHY,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["my-pets"] }),
        queryClient.invalidateQueries({ queryKey: ["my-pet-detail", id] }),
      ]);
      router.back();
    },
    onError: (error) => {
      Alert.alert("Không thể lưu", error instanceof Error ? error.message : "Vui lòng thử lại.");
    },
  });

  const canSave = useMemo(() => name.trim().length > 0 && breed.trim().length > 0, [breed, name]);

  if (petQuery.isLoading && !pet) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <Text style={{ color: textColor, fontSize: 16, fontWeight: "700" }}>Không tìm thấy hồ sơ thú cưng.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <HeaderBar
        title="Cập nhật"
        onBack={() => router.back()}
        rightSlot={
          <Pressable
            onPress={canSave ? () => saveMutation.mutate() : undefined}
            style={{
              borderRadius: MY_PET_TOKENS.radius.pill,
              backgroundColor: canSave ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
              paddingHorizontal: 12,
              paddingVertical: 7,
            }}
          >
            <Text style={{ color: canSave ? "white" : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "700" }}>
              {saveMutation.isPending ? "Đang lưu" : "Lưu"}
            </Text>
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: MY_PET_TOKENS.spacing.screenX,
          paddingBottom: Math.max(insets.bottom + 96, 112),
        }}
        showsVerticalScrollIndicator={false}
      >

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
          <LabeledInput label="Cân nặng" value={weight} onChangeText={setWeight} placeholder="Ví dụ: 7.8" />
          <LabeledInput label="Màu lông" value={color} onChangeText={setColor} placeholder="Ví dụ: Vàng kem" />
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
            Dữ liệu bên dưới đang được dựng từ hồ sơ hiện có trên API.
          </Text>
          <View style={{ marginTop: 8 }}>
            {pet.checklists.map((item) => (
              <ChecklistRow key={item.id} title={item.title} detail={item.detail} tone={item.tone} />
            ))}
          </View>
        </MyPetPanel>
      </ScrollView>

      <Pressable
        onPress={() => (canSave ? saveMutation.mutate() : undefined)}
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
