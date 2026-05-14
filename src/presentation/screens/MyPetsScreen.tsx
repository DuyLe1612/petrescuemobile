import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import {
  MY_PET_TOKENS,
  MyPetPanel,
  MyPetTopBar,
  PrimaryButton,
  StatCard,
  ToneChip,
} from "@/src/presentation/components/my-pets/ui";
import { MY_PETS } from "@/src/presentation/mocks/my-pets";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MyPetsScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primaryColor = useThemeColor({}, "tint");

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
        title="Thú cưng của tôi"
        onBack={() => router.back()}
        rightSlot={
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: MY_PET_TOKENS.radius.pill,
              backgroundColor: "#ff9f43",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>{MY_PETS.length}</Text>
          </View>
        }
      />

      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
        <StatCard value={`${MY_PETS.length}`} label="Tổng" accent="#ff9f43" />
        <StatCard value={`${MY_PETS.filter((pet) => pet.statusTone === "good").length}`} label="Thành viên" accent="#44b882" />
      </View>

      <View style={{ marginTop: 14, gap: 12 }}>
        {MY_PETS.map((pet) => (
          <Pressable
            key={pet.id}
            onPress={() => router.push({ pathname: "/my-pets/[id]", params: { id: pet.id } })}
          >
            <MyPetPanel style={{ flexDirection: "row", alignItems: "center" }}>
              <FastImage
                source={{ uri: pet.imageUrl }}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: MY_PET_TOKENS.radius.image,
                  marginRight: 12,
                }}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: textColor, fontSize: 16, fontWeight: "800" }}>{pet.name}</Text>
                  <ToneChip label={pet.statusLabel} tone={pet.statusTone} compact />
                </View>
                <Text style={{ color: mutedColor, fontSize: 12, marginTop: 4 }}>
                  {pet.species} • {pet.breed}
                </Text>
                <Text style={{ color: mutedColor, fontSize: 12, marginTop: 6 }} numberOfLines={2}>
                  {pet.shortNote}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={primaryColor} />
            </MyPetPanel>
          </Pressable>
        ))}
      </View>

      <MyPetPanel
        style={{
          marginTop: 14,
          alignItems: "center",
          borderStyle: "dashed",
          borderWidth: 1,
          borderColor: "rgba(39,127,143,0.24)",
          backgroundColor: "rgba(39,127,143,0.06)",
        }}
      >
        <Pressable
          onPress={() => router.push("/my-pets/create")}
          style={{ width: "100%", alignItems: "center" }}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: MY_PET_TOKENS.radius.pill,
              backgroundColor: "rgba(39,127,143,0.12)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="plus" size={18} color={primaryColor} />
          </View>
          <Text style={{ color: textColor, fontSize: 14, fontWeight: "700", marginTop: 10 }}>
            Thêm thú cưng mới
          </Text>
          <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>
            Lưu hồ sơ chăm sóc và nhật ký riêng cho từng bé.
          </Text>
        </Pressable>
      </MyPetPanel>

      <View style={{ marginTop: 16 }}>
        <PrimaryButton label="Thêm thú cưng ngay" onPress={() => router.push("/my-pets/create")} />
      </View>
    </ScrollView>
  );
}
