import { queryClient } from "@/app/_layout";
import type { AdoptionPet } from "@/src/domain/entities/adoption-pet";
import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { fetchPetDetail } from "@/src/presentation/data/pet-api";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Defs, LinearGradient as SvgLinearGradient, Rect, Stop, Svg } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-1 rounded-3xl bg-muted px-4 py-4">
    <Text className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
      {label}
    </Text>
    <Text className="mt-2 text-base font-bold text-foreground">{value}</Text>
  </View>
);

const GradientButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.92} className="overflow-hidden rounded-full">
    <View className="relative items-center justify-center px-6 py-4">
      <Svg className="absolute inset-0 h-full w-full" width="100%" height="100%">
        <Defs>
          <SvgLinearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#1f6f7b" />
            <Stop offset="55%" stopColor="#277f8f" />
            <Stop offset="100%" stopColor="#52a9b7" />
          </SvgLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#ctaGradient)" rx="999" />
      </Svg>
      <Text className="text-base font-extrabold text-white">{label}</Text>
    </View>
  </TouchableOpacity>
);

const getSpeciesLabel = (pet: AdoptionPet) => {
  if (pet.species === "dog") return "Chó";
  if (pet.species === "cat") return "Mèo";
  if (pet.species === "bird") return "Chim";
  return "Thỏ";
};

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const initialPet = queryClient.getQueryData<AdoptionPet>(["pet-detail", id]);

  const detailQuery = useQuery({
    queryKey: ["pet-detail", id],
    queryFn: () => fetchPetDetail(id),
    initialData: initialPet,
  });

  const pet = detailQuery.data;

  if (detailQuery.isLoading && !pet) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center text-base font-semibold text-foreground">
          Không tìm thấy thông tin thú cưng.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 180 }}>
        <View className="relative">
          <FastImage source={{ uri: pet.imageUrl }} style={{ width: "100%", height: 360 }} />
          <View
            className="absolute left-0 right-0 flex-row items-center justify-between px-4"
            style={{ top: insets.top + 8 }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Quay lại danh sách thú cưng"
              className="h-11 w-11 items-center justify-center rounded-full bg-black/40"
            >
              <Feather name="chevron-left" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Thông báo", "Chức năng yêu thích chưa được backend hỗ trợ trong app này.")
              }
              accessibilityRole="button"
              accessibilityLabel="Yêu thích"
              className="h-11 w-11 items-center justify-center rounded-full bg-black/40"
            >
              <Ionicons name="heart-outline" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="-mt-8 rounded-t-[36px] bg-card px-5 pb-8 pt-6 shadow-soft-1">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-[28px] font-extrabold text-foreground">{pet.name}</Text>
              <Text className="mt-2 text-sm font-semibold text-primary">{pet.shelterName}</Text>
            </View>
            <View className="rounded-full bg-muted px-4 py-2">
              <Text className="text-xs font-bold text-foreground">{pet.badge}</Text>
            </View>
          </View>

          <View className="mt-5 flex-row gap-3">
            <InfoTile label="Tuổi" value={pet.ageLabel} />
            <InfoTile label="Loài" value={getSpeciesLabel(pet)} />
          </View>

          <View className="mt-5">
            <Text className="text-sm font-bold text-foreground">Tình trạng sức khỏe</Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {pet.healthBadges.map((badge) => (
                <View key={badge} className="rounded-full bg-emerald-50 px-4 py-2">
                  <Text className="text-xs font-semibold text-emerald-700">{badge}</Text>
                </View>
              ))}
            </View>
          </View>

          <View className="mt-6 rounded-[28px] bg-muted px-4 py-4">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={pet.gender === "male" ? "male" : "female"}
                size={16}
                color="#277f8f"
              />
              <Text className="text-sm font-semibold text-foreground">
                {pet.gender === "male" ? "Đực" : "Cái"}
              </Text>
              <Feather name="map-pin" size={15} color="#277f8f" />
              <Text className="flex-1 text-sm text-muted-foreground">{pet.location}</Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-sm font-bold text-foreground">Mô tả</Text>
            <Text className="mt-3 text-[15px] leading-7 text-muted-foreground">
              {pet.description}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-sm font-bold text-foreground">Câu chuyện của bé</Text>
            <Text className="mt-3 text-[15px] leading-7 text-muted-foreground">{pet.story}</Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 border-t border-border bg-background px-4"
        style={{ paddingTop: 14, paddingBottom: Math.max(insets.bottom + 12, 20) }}
      >
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Chat với shelter", "Luồng chat chưa được backend/app này hỗ trợ.")
            }
            accessibilityRole="button"
            accessibilityLabel="Chat với shelter"
            className="h-14 w-14 items-center justify-center rounded-full border border-border bg-card"
          >
            <Feather name="message-circle" size={20} color="#277f8f" />
          </TouchableOpacity>
          <View className="flex-1">
            <GradientButton
              label="Nhận nuôi bé ngay"
              onPress={() =>
                Alert.alert("Adoption Form", "Luồng tạo đơn nhận nuôi sẽ được nối ở bước tiếp theo.")
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}
