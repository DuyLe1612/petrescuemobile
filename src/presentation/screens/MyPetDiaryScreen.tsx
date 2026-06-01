import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { MY_PET_TOKENS, MyPetPanel, MyPetTopBar, ToneChip } from "@/src/presentation/components/my-pets/ui";
import { fetchMyPetDetail } from "@/src/presentation/data/pet-api";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPetDiaryScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
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
        <Text style={{ color: textColor, fontSize: 16, fontWeight: "700" }}>Không tìm thấy nhật ký thú cưng.</Text>
      </View>
    );
  }

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
      <MyPetTopBar title={`Nhật ký - ${pet.name}`} onBack={() => router.back()} />

      <MyPetPanel style={{ marginTop: 12 }}>
        <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>Mốc gần nhất</Text>
        <Text style={{ color: mutedColor, fontSize: 12, marginTop: 6 }}>
          Nhật ký này được dựng từ media và lịch sử sở hữu đang có trên API của thú cưng.
        </Text>
      </MyPetPanel>

      <View style={{ marginTop: 14, gap: 12 }}>
        {pet.diary.length === 0 ? (
          <MyPetPanel>
            <Text style={{ color: mutedColor, fontSize: 13 }}>
              Chưa có media hoặc ownership history để hiển thị nhật ký.
            </Text>
          </MyPetPanel>
        ) : null}

        {pet.diary.map((entry) => (
          <MyPetPanel key={entry.id}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{ color: textColor, fontSize: 14, fontWeight: "800" }}>{entry.title}</Text>
                <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>{entry.subtitle}</Text>
              </View>
              <ToneChip label={entry.mood} tone={entry.moodTone} compact />
            </View>

            {entry.imageUrl ? (
              <FastImage
                source={{ uri: entry.imageUrl }}
                style={{
                  width: "100%",
                  height: 158,
                  borderRadius: MY_PET_TOKENS.radius.image,
                  marginTop: 12,
                }}
              />
            ) : null}

            <Text style={{ color: textColor, fontSize: 13, lineHeight: 20, marginTop: 12 }}>
              {entry.note}
            </Text>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {entry.tags.map((tag) => (
                <View
                  key={tag}
                  style={{
                    borderRadius: MY_PET_TOKENS.radius.pill,
                    backgroundColor: "rgba(39,127,143,0.10)",
                    paddingHorizontal: 9,
                    paddingVertical: 4,
                  }}
                >
                  <Text style={{ color: "#277f8f", fontSize: 11, fontWeight: "700" }}>#{tag}</Text>
                </View>
              ))}
            </View>
          </MyPetPanel>
        ))}
      </View>
    </ScrollView>
  );
}
