import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import {
  ChecklistRow,
  InfoRow,
  MY_PET_TOKENS,
  MyPetPanel,
  PrimaryButton,
  SecondaryButton,
  ToneChip,
} from "@/src/presentation/components/my-pets/ui";
import { fetchMyPetDetail } from "@/src/presentation/data/pet-api";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPetDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primaryColor = useThemeColor({}, "tint");
  const petQuery = useQuery({
    queryKey: ["my-pet-detail", id],
    queryFn: () => fetchMyPetDetail(id ?? ""),
    enabled: Boolean(id),
  });
  const pet = petQuery.data;

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
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 116, 132) }}>
        <View style={{ position: "relative" }}>
          <FastImage source={{ uri: pet.imageUrl }} style={{ width: "100%", height: 240 }} />
          <View
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: insets.top + 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 38,
                height: 38,
                borderRadius: MY_PET_TOKENS.radius.pill,
                backgroundColor: "rgba(0,0,0,0.28)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="chevron-left" size={20} color="#ffffff" />
            </Pressable>

            <Pressable
              onPress={() => router.push({ pathname: "/my-pets/[id]/edit", params: { id: pet.id } })}
              style={{
                borderRadius: MY_PET_TOKENS.radius.pill,
                backgroundColor: "rgba(255,255,255,0.88)",
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather name="edit-3" size={14} color={primaryColor} />
              <Text style={{ color: primaryColor, fontSize: 12, fontWeight: "700", marginLeft: 6 }}>Sửa</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            marginTop: -28,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            backgroundColor,
            paddingHorizontal: MY_PET_TOKENS.spacing.screenX,
            paddingTop: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: textColor, fontSize: 24, fontWeight: "800" }}>{pet.name}</Text>
              <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>
                {pet.species} • {pet.breed}
              </Text>
            </View>
            <ToneChip label={pet.statusLabel} tone={pet.statusTone} />
          </View>

          <MyPetPanel style={{ marginTop: 14 }}>
            <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Thông tin cơ bản</Text>
            <InfoRow label="Tuổi" value={pet.ageLabel} />
            <InfoRow label="Giới tính" value={pet.gender} />
            <InfoRow label="Cân nặng" value={pet.weightLabel} />
            <InfoRow label="Màu lông" value={pet.color} />
            <InfoRow label="Địa điểm cứu hộ" value={pet.rescueLocation} />
          </MyPetPanel>

          <MyPetPanel style={{ marginTop: 14 }}>
            <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Tình trạng chăm sóc</Text>
            <InfoRow label="Tiêm vaccine" value={pet.vaccineLabel} highlight="#44b882" />
            <InfoRow label="Tẩy giun" value={pet.dewormLabel} highlight="#ff9f43" />
            <InfoRow label="Triệt sản" value={pet.neuterLabel} highlight="#ff6f61" />
            <InfoRow label="Người nuôi hiện tại" value={pet.ownerLabel} />
          </MyPetPanel>

          <MyPetPanel style={{ marginTop: 14 }}>
            <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Checklist sức khỏe</Text>
            <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>{pet.healthSummary}</Text>
            <View style={{ marginTop: 8 }}>
              {pet.checklists.map((item) => (
                <ChecklistRow key={item.id} title={item.title} detail={item.detail} tone={item.tone} />
              ))}
            </View>
          </MyPetPanel>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: cardColor,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: Math.max(insets.bottom + 12, 18),
        }}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <SecondaryButton
              label="Nhật ký"
              onPress={() => router.push({ pathname: "/my-pets/[id]/diary", params: { id: pet.id } })}
            />
          </View>
          <View style={{ flex: 1 }}>
            <PrimaryButton
              label="Sửa hồ sơ"
              onPress={() => router.push({ pathname: "/my-pets/[id]/edit", params: { id: pet.id } })}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
