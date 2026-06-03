import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { type AdoptionPet } from "@/src/domain/entities/adoption-pet";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type ReactNode, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchAvailablePets } from "@/src/presentation/data/pet-api";

const HOME_TOKENS = {
  radius: {
    card: 24,
    inner: 16,
    pill: 999,
  },
  shadow: {
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
} as const;

const STATS = [
  { value: "3,201", label: "Ca cứu hộ", color: "#0a4c73" },
  { value: "1,298", label: "Đã có chủ", color: "#44b882" },
  { value: "473", label: "Chờ tiêm phòng", color: "#2596d6" },
  { value: "213", label: "Đang phục hồi", color: "#f59e0b" },
] as const;

const ACTIONS = [
  {
    title: "Nhận nuôi",
    description: "Hãy nhận nuôi một thành viên đáng yêu.",
    icon: "home",
    iconSet: "feather",
    surface: "rgba(10,76,115,0.1)",
    onPress: () => router.push("/adoption"),
  },
  {
    title: "Ủng hộ",
    description: "Quyên góp để duy trì hoạt động của PAW HOME.",
    icon: "gift-outline",
    iconSet: "material",
    surface: "rgba(245,158,11,0.1)",
    onPress: () => router.push("/profile"),
  },
  {
    title: "Tình nguyện",
    description: "Hành động thay đổi cuộc sống thú cưng.",
    icon: "hand-heart-outline",
    iconSet: "material",
    surface: "rgba(10,76,115,0.1)",
    onPress: () => router.push("/profile"),
  },
] as const;

export default function HomeScreen() {
  const [featuredPets, setFeaturedPets] = useState<AdoptionPet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e2e8f0", dark: "#2d2d2c" }, "icon");

  useEffect(() => {
    fetchAvailablePets({
      filters: { keyword: "", species: "all", status: "all" },
      page: 0,
      pageSize: 2,
    })
      .then((response) => {
        setFeaturedPets(response.items);
      })
      .catch(() => {
        setFeaturedPets([]);
      })
      .finally(() => {
        setIsLoadingPets(false);
      });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width elegant header */}
        <View
          style={{
            backgroundColor: "#0a4c73",
            paddingTop: insets.top + 20,
            paddingBottom: 76,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13, fontWeight: "500" }}>
                Xin chào
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "900",
                  marginTop: 4,
                  letterSpacing: -0.5,
                }}
              >
                PAW HOME
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/news")}
              accessibilityRole="button"
              accessibilityLabel="Thông báo"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications-outline" size={18} color="white" />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#38bdf8",
                  borderWidth: 1.5,
                  borderColor: "#0a4c73",
                }}
              />
            </Pressable>
          </View>

          <View
            style={{
              marginTop: 14,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              paddingHorizontal: 12,
              paddingVertical: 6,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="location-outline" size={14} color="white" />
            <Text style={{ color: "white", fontSize: 12, marginLeft: 6, fontWeight: "600" }}>
              Hà Nội, Việt Nam
            </Text>
          </View>
        </View>

        {/* Content Wrapper */}
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          {/* Overlapping Stats Card */}
          <View
            style={{
              marginTop: -44,
              borderRadius: HOME_TOKENS.radius.card,
              backgroundColor: cardColor,
              paddingHorizontal: 12,
              paddingVertical: 18,
              flexDirection: "row",
              flexWrap: "wrap",
              borderWidth: 1,
              borderColor: borderColor,
              ...HOME_TOKENS.shadow,
            }}
          >
            {STATS.map((item) => (
              <View
                key={item.label}
                style={{
                  width: "25%",
                  paddingHorizontal: 4,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: item.color, fontSize: 18, fontWeight: "900" }}>{item.value}</Text>
                <Text
                  style={{
                    color: mutedColor,
                    fontSize: 10,
                    marginTop: 6,
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Tham gia cùng chúng tôi" />
          <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
            {ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                surface={action.surface}
                onPress={action.onPress}
                borderColor={borderColor}
                icon={
                  action.iconSet === "feather" ? (
                    <Feather name={action.icon as "home"} size={18} color="#0a4c73" />
                  ) : (
                    <MaterialCommunityIcons
                      name={action.icon as "gift-outline" | "hand-heart-outline"}
                      size={18}
                      color="#0a4c73"
                    />
                  )
                }
              />
            ))}
          </View>

          <View
            style={{
              marginTop: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: textColor, fontSize: 20, fontWeight: "900", letterSpacing: -0.5 }}>
              Bé ngoan trong tuần
            </Text>
            <Pressable onPress={() => router.push("/adoption")}>
              <Text style={{ color: "#0a4c73", fontSize: 13, fontWeight: "800" }}>Xem tất cả</Text>
            </Pressable>
          </View>

          {isLoadingPets ? (
            <View
              style={{
                marginTop: 14,
                height: 220,
                borderRadius: HOME_TOKENS.radius.card,
                backgroundColor: cardColor,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: borderColor,
                ...HOME_TOKENS.shadow,
              }}
            >
              <ActivityIndicator color={primaryColor} />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingTop: 14, paddingBottom: 4 }}
            >
              {featuredPets.map((pet) => (
                <FeaturedPetCard
                  key={pet.id}
                  pet={pet}
                  cardColor={cardColor}
                  mutedColor={mutedColor}
                  borderColor={borderColor}
                />
              ))}
            </ScrollView>
          )}

          {/* About Card banner */}
          <View
            style={{
              marginTop: 28,
              borderRadius: HOME_TOKENS.radius.card,
              backgroundColor: "#0a4c73",
              paddingHorizontal: 20,
              paddingVertical: 20,
              shadowColor: "#0a4c73",
              shadowOpacity: 0.15,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 8 },
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={iconSurfaceStyle("rgba(255,255,255,0.12)")}>
                <MaterialCommunityIcons name="paw-outline" size={20} color="#38bdf8" />
              </View>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "900", marginLeft: 10 }}>
                Về PAW HOME
              </Text>
            </View>

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: 13,
                lineHeight: 20,
                marginTop: 12,
                fontWeight: "500",
              }}
            >
              Nhóm trẻ gồm tình nguyện viên Việt Nam, hoạt động cứu hộ chó mèo từ năm 2015. Ấp ủ phổ cập triệt sản,
              chăm sóc y tế và tìm mái ấm mới cho hàng trăm bé mỗi năm.
            </Text>

            <Pressable
              onPress={() => router.push("/profile")}
              accessibilityRole="button"
              accessibilityLabel="Tìm hiểu thêm"
              style={{
                marginTop: 16,
                alignSelf: "flex-start",
                backgroundColor: "#38bdf8",
                borderRadius: HOME_TOKENS.radius.pill,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            >
              <Text style={{ color: "#0a4c73", fontSize: 13, fontWeight: "800" }}>Tìm hiểu thêm</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Post Button matching feed */}
      <Pressable
        onPress={() => router.push("/post/create")}
        accessibilityRole="button"
        accessibilityLabel="Thêm bài post mới"
        style={{
          position: "absolute",
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#0a4c73",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#0a4c73",
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 5,
        }}
      >
        <Feather name="plus" size={24} color="white" />
      </Pressable>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const textColor = useThemeColor({}, "text");

  return (
    <Text
      style={{
        marginTop: 24,
        color: textColor,
        fontSize: 20,
        fontWeight: "900",
        letterSpacing: -0.5,
      }}
    >
      {title}
    </Text>
  );
}

function ActionCard({
  icon,
  title,
  description,
  surface,
  onPress,
  borderColor,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  surface: string;
  onPress: () => void;
  borderColor: string;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#1f1f1e" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{
        flex: 1,
        borderRadius: HOME_TOKENS.radius.card,
        backgroundColor: cardColor,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: borderColor,
        ...HOME_TOKENS.shadow,
      }}
    >
      <View style={iconSurfaceStyle(surface)}>{icon}</View>
      <Text style={{ color: textColor, fontSize: 14, fontWeight: "800", marginTop: 12 }}>{title}</Text>
      <Text style={{ color: mutedColor, fontSize: 11, lineHeight: 16, marginTop: 6, fontWeight: "500" }}>
        {description}
      </Text>
    </Pressable>
  );
}

function FeaturedPetCard({
  pet,
  cardColor,
  mutedColor,
  borderColor,
}: {
  pet: AdoptionPet;
  cardColor: string;
  mutedColor: string;
  borderColor: string;
}) {
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable
      onPress={() => router.push("/adoption")}
      accessibilityRole="button"
      accessibilityLabel={`Thú cưng ${pet.name}`}
      style={{
        width: 176,
        borderRadius: 20,
        backgroundColor: cardColor,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: borderColor,
        ...HOME_TOKENS.shadow,
      }}
    >
      <View>
        <FastImage source={{ uri: pet.imageUrl }} style={{ width: "100%", height: 120 }} />
        <View
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            borderRadius: HOME_TOKENS.radius.pill,
            backgroundColor: "rgba(0,0,0,0.55)",
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>
            {pet.species === "dog" ? "Chó" : pet.species === "cat" ? "Mèo" : "Khác"}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.9)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={pet.favorite ? "heart" : "heart-outline"}
            size={14}
            color={pet.favorite ? "#ef4444" : mutedColor}
          />
        </View>
      </View>

      <View style={{ padding: 12 }}>
        <Text style={{ color: textColor, fontSize: 18, fontWeight: "900" }}>{pet.name}</Text>
        <Text style={{ color: mutedColor, fontSize: 11, marginTop: 2, fontWeight: "500" }}>
          {pet.adult ? "Trưởng thành" : "Chưa trưởng thành"}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <View
            style={{
              borderRadius: 8,
              backgroundColor: "rgba(68,184,130,0.08)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: "rgba(68,184,130,0.15)",
            }}
          >
            <Text style={{ color: "#44b882", fontSize: 9, fontWeight: "800" }}>
              {pet.vaccinated ? "Đã tiêm" : "Cần tiêm"}
            </Text>
          </View>
          <Ionicons
            name={pet.gender === "female" ? "female" : "male"}
            size={14}
            color={pet.gender === "female" ? "#d46474" : "#2596d6"}
          />
        </View>
      </View>
    </Pressable>
  );
}

function iconSurfaceStyle(backgroundColor: string) {
  return {
    width: 36,
    height: 36,
    borderRadius: HOME_TOKENS.radius.inner,
    backgroundColor,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}
