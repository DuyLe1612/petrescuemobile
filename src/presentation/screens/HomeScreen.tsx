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
  spacing: {
    screenX: 20,
    top: 68,
    section: 22,
    blockGap: 16,
  },
  radius: {
    hero: 30,
    card: 24,
    inner: 18,
    pill: 999,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

const STATS = [
  { value: "3,201", label: "Ca cứu hộ", color: "#ff8c38" },
  { value: "1,298", label: "Đã có chủ", color: "#5fb95c" },
  { value: "473", label: "Chờ tiêm chủng", color: "#1f9bd1" },
  { value: "213", label: "Đang phục hồi", color: "#f2b94b" },
] as const;

const ACTIONS = [
  {
    title: "Nhận nuôi",
    description: "Hãy nhận nuôi một thành viên đáng yêu.",
    icon: "home",
    iconSet: "feather",
    surface: "rgba(255,140,56,0.12)",
    onPress: () => router.push("/adoption"),
  },
  {
    title: "Ủng hộ",
    description: "Quyên góp để duy trì hoạt động của HPA.",
    icon: "gift-outline",
    iconSet: "material",
    surface: "rgba(255,159,67,0.12)",
    onPress: () =>
      router.push("/profile"),
  },
  {
    title: "Tình nguyện",
    description: "Hành động thay đổi cuộc sống thú cưng.",
    icon: "hand-heart-outline",
    iconSet: "material",
    surface: "rgba(39,127,143,0.12)",
    onPress: () => router.push("/profile"),
  },
] as const;

export default function HomeScreen() {
  const [featuredPets, setFeaturedPets] = useState<AdoptionPet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

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
        style={{ flex: 1, backgroundColor }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width header */}
        <View
          style={{
            backgroundColor: "#0a4c73",
            paddingTop: insets.top + 20,
            paddingBottom: 72,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 13 }}>
                Xin chào
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 28,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
                Hanoi Pet Adoption
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/news")}
              accessibilityRole="button"
              accessibilityLabel="Thông báo"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications-outline" size={18} color="white" />
              <View
                style={{
                  position: "absolute",
                  top: 8,
                  right: 9,
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  backgroundColor: "#ff8c38",
                }}
              />
            </Pressable>
          </View>

          <View
            style={{
              marginTop: 16,
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-start",
            }}
          >
            <Ionicons name="location-outline" size={15} color="rgba(255, 255, 255, 0.9)" />
            <Text style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: 13, marginLeft: 8 }}>
              Hà Nội, Việt Nam
            </Text>
          </View>
        </View>

        {/* Content Wrapper */}
        <View
          style={{
            paddingHorizontal: HOME_TOKENS.spacing.screenX,
          }}
        >
          <View
            style={{
              marginTop: -42,
              borderRadius: HOME_TOKENS.radius.card,
              backgroundColor: cardColor,
              paddingHorizontal: 12,
              paddingVertical: 14,
              flexDirection: "row",
              flexWrap: "wrap",
              ...HOME_TOKENS.shadow,
            }}
          >
            {STATS.map((item) => (
              <View
                key={item.label}
                style={{
                  width: "25%",
                  paddingHorizontal: 6,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: item.color, fontSize: 18, fontWeight: "800" }}>{item.value}</Text>
                <Text
                  style={{
                    color: mutedColor,
                    fontSize: 11,
                    marginTop: 4,
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          <SectionHeader title="Tham gia cùng chúng tôi" />
          <View style={{ flexDirection: "row", gap: 10 }}>
            {ACTIONS.map((action) => (
              <ActionCard
                key={action.title}
                title={action.title}
                description={action.description}
                surface={action.surface}
                onPress={action.onPress}
                icon={
                  action.iconSet === "feather" ? (
                    <Feather name={action.icon as "home"} size={18} color={primaryColor} />
                  ) : (
                    <MaterialCommunityIcons
                      name={action.icon as "gift-outline" | "hand-heart-outline"}
                      size={18}
                      color={primaryColor}
                    />
                  )
                }
              />
            ))}
          </View>

          <View
            style={{
              marginTop: HOME_TOKENS.spacing.section,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ color: textColor, fontSize: 21, fontWeight: "800" }}>Bé ngoan trong tuần</Text>
            <Pressable onPress={() => router.push("/adoption")}>
              <Text style={{ color: "#ff8c38", fontSize: 14, fontWeight: "700" }}>Xem tất cả</Text>
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
                ...HOME_TOKENS.shadow,
              }}
            >
              <ActivityIndicator color={primaryColor} />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingTop: 14 }}
            >
              {featuredPets.map((pet) => (
                <FeaturedPetCard key={pet.id} pet={pet} cardColor={cardColor} mutedColor={mutedColor} />
              ))}
            </ScrollView>
          )}

          <View
            style={{
              marginTop: HOME_TOKENS.spacing.section,
              borderRadius: HOME_TOKENS.radius.hero,
              backgroundColor: primaryColor,
              paddingHorizontal: 18,
              paddingVertical: 18,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={iconSurfaceStyle("rgba(255,255,255,0.14)")}>
                <MaterialCommunityIcons name="paw-outline" size={20} color="#ff8c38" />
              </View>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
                Về Hanoi Pet Adoption
              </Text>
            </View>

            <Text
              style={{
                color: "rgba(246,252,252,0.86)",
                fontSize: 13,
                lineHeight: 20,
                marginTop: 12,
              }}
            >
              Nhóm trẻ gồm tình nguyện viên Việt Nam, hoạt động từ năm 2015. Ấp ủ phổ cập triệt sản,
              chăm sóc và tìm mái ấm mới cho hàng trăm bé mỗi năm.
            </Text>

            <Pressable
              onPress={() => router.push("/profile")}
              accessibilityRole="button"
              accessibilityLabel="Tìm hiểu thêm"
              style={{
                marginTop: 14,
                alignSelf: "flex-start",
                backgroundColor: "#ff8c38",
                borderRadius: HOME_TOKENS.radius.pill,
                paddingHorizontal: 16,
                paddingVertical: 9,
              }}
            >
              <Text style={{ color: "white", fontSize: 13, fontWeight: "700" }}>Tìm hiểu thêm</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/post/create")}
        accessibilityRole="button"
        accessibilityLabel="Thêm bài post mới"
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          width: 58,
          height: 58,
          borderRadius: HOME_TOKENS.radius.pill,
          backgroundColor: primaryColor,
          alignItems: "center",
          justifyContent: "center",
          ...HOME_TOKENS.shadow,
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
        marginTop: HOME_TOKENS.spacing.section,
        color: textColor,
        fontSize: 21,
        fontWeight: "800",
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
}: {
  icon: ReactNode;
  title: string;
  description: string;
  surface: string;
  onPress: () => void;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
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
        paddingVertical: 14,
        ...HOME_TOKENS.shadow,
      }}
    >
      <View style={iconSurfaceStyle(surface)}>{icon}</View>
      <Text style={{ color: textColor, fontSize: 14, fontWeight: "700", marginTop: 10 }}>{title}</Text>
      <Text style={{ color: mutedColor, fontSize: 11, lineHeight: 17, marginTop: 6 }}>{description}</Text>
    </Pressable>
  );
}

function FeaturedPetCard({
  pet,
  cardColor,
  mutedColor,
}: {
  pet: AdoptionPet;
  cardColor: string;
  mutedColor: string;
}) {
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable
      onPress={() => router.push("/adoption")}
      accessibilityRole="button"
      accessibilityLabel={`Thú cưng ${pet.name}`}
      style={{
        width: 174,
        borderRadius: 22,
        backgroundColor: cardColor,
        overflow: "hidden",
        ...HOME_TOKENS.shadow,
      }}
    >
      <View>
        <FastImage source={{ uri: pet.imageUrl }} style={{ width: "100%", height: 132 }} />
        <View
          style={{
            position: "absolute",
            left: 10,
            bottom: 10,
            borderRadius: HOME_TOKENS.radius.pill,
            backgroundColor: "rgba(0,0,0,0.5)",
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
            borderRadius: HOME_TOKENS.radius.pill,
            backgroundColor: "rgba(255,255,255,0.9)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={pet.favorite ? "heart" : "heart-outline"}
            size={15}
            color={pet.favorite ? "#d46474" : mutedColor}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
        <Text style={{ color: textColor, fontSize: 20, fontWeight: "800" }}>{pet.name}</Text>
        <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>
          {pet.adult ? "Trưởng thành" : "Chưa trưởng thành"}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
          <View
            style={{
              borderRadius: HOME_TOKENS.radius.pill,
              backgroundColor: "rgba(95,185,92,0.12)",
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ color: "#5fb95c", fontSize: 10, fontWeight: "700" }}>
              {pet.vaccinated ? "Tiêm phòng" : "Cần tiêm"}
            </Text>
          </View>
          <Ionicons name={pet.gender === "male" ? "male" : "female"} size={14} color="#d46474" />
        </View>
      </View>
    </Pressable>
  );
}

function LocationPill({ text }: { text: string }) {
  return (
    <View
      style={{
        marginTop: 16,
        borderRadius: HOME_TOKENS.radius.pill,
        backgroundColor: "rgba(255,255,255,0.14)",
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ionicons name="location-outline" size={16} color="rgba(246,252,252,0.9)" />
      <Text style={{ color: "rgba(246,252,252,0.9)", fontSize: 13, marginLeft: 8 }}>{text}</Text>
    </View>
  );
}

function circleButtonStyle(backgroundColor: string) {
  return {
    width: 34,
    height: 34,
    borderRadius: HOME_TOKENS.radius.pill,
    backgroundColor,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}

function iconSurfaceStyle(backgroundColor: string) {
  return {
    width: 38,
    height: 38,
    borderRadius: HOME_TOKENS.radius.inner,
    backgroundColor,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };
}
