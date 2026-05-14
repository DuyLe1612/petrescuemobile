import { FastImage } from "@/src/presentation/components/adoption/FastImage";
import { fetchMockAdoptionPets } from "@/src/infrastructure/mocks/adoption-pets";
import { type AdoptionPet } from "@/src/domain/entities/adoption-pet";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type ReactNode, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

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
  const status = useSessionBootstrap();
  const [featuredPets, setFeaturedPets] = useState<AdoptionPet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);

  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  useEffect(() => {
    const controller = new AbortController();

    fetchMockAdoptionPets({
      filters: { keyword: "", species: "all", status: "all" },
      page: 0,
      pageSize: 2,
      signal: controller.signal,
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

    return () => controller.abort();
  }, []);

  if (status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <ActivityIndicator color={primaryColor} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          paddingHorizontal: HOME_TOKENS.spacing.screenX,
          paddingTop: HOME_TOKENS.spacing.top,
        }}
      >
        <View
          style={{
            borderRadius: HOME_TOKENS.radius.hero,
            backgroundColor: primaryColor,
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 86,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "rgba(246,252,252,0.82)", fontSize: 13 }}>
                {status === "authenticated" ? "Chào mừng trở lại" : "Xin chào"}
              </Text>
              <Text
                style={{
                  color: "rgb(246 252 252)",
                  fontSize: 29,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
                Hanoi Pet Adoption
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/profile")}
              accessibilityRole="button"
              accessibilityLabel="Thông báo"
              style={{
                width: 34,
                height: 34,
                borderRadius: HOME_TOKENS.radius.pill,
                backgroundColor: "rgba(255,255,255,0.12)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="notifications-outline" size={18} color="white" />
              <View
                style={{
                  position: "absolute",
                  top: 7,
                  right: 8,
                  width: 7,
                  height: 7,
                  borderRadius: HOME_TOKENS.radius.pill,
                  backgroundColor: "#ff8c38",
                }}
              />
            </Pressable>
          </View>

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
            <Text style={{ color: "rgba(246,252,252,0.9)", fontSize: 13, marginLeft: 8 }}>
              Hà Nội, Việt Nam
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: -58,
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
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: HOME_TOKENS.radius.pill,
                backgroundColor: "rgba(255,255,255,0.14)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
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
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: HOME_TOKENS.radius.inner,
          backgroundColor: surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <Text style={{ color: textColor, fontSize: 14, fontWeight: "700", marginTop: 10 }}>
        {title}
      </Text>
      <Text style={{ color: mutedColor, fontSize: 11, lineHeight: 17, marginTop: 6 }}>
        {description}
      </Text>
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
  const primaryColor = useThemeColor({}, "tint");

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
