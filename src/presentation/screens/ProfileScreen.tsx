import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Ionicons, Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { type ReactNode, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/src/infrastructure/api/generated/pet-rescue-api";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

const PROFILE_TOKENS = {
  spacing: {
    screenX: 20,
    top: 24,
    section: 20,
    blockGap: 14,
    cardX: 16,
  },
  radius: {
    hero: 0, // Header is full width now, so no hero border radius
    card: 16,
    pill: 999,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
} as const;


const GuestProfile = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const insets = useSafeAreaInsets();

  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#232321" },
    "background",
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor(
    { light: "#e9eff4", dark: "rgb(58 58 58)" },
    "icon",
  );
  const subtleSurface = useThemeColor(
    { light: "#e8f2f7", dark: "rgb(42 39 36)" },
    "background",
  );
  const sectionTitle = useThemeColor(
    { light: "#8c9ba5", dark: mutedColor },
    "icon",
  );

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width header */}
        <View
          style={{
            backgroundColor: "#0a4c73",
            paddingTop: insets.top + 20,
            paddingBottom: 28,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 66,
                height: 66,
                borderRadius: 33,
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.4)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 16,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
              }}
            >
              <Ionicons name="person-outline" size={32} color="white" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
                Khách
              </Text>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 12, marginTop: 4 }}>
                Đăng nhập để sử dụng đầy đủ
              </Text>
              <Pressable
                onPress={() => router.push("/login")}
                accessibilityRole="button"
                accessibilityLabel="Đăng nhập"
                style={({ pressed }) => ({
                  marginTop: 8,
                  backgroundColor: pressed ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.18)",
                  borderRadius: 999,
                  paddingHorizontal: 20,
                  paddingVertical: 6,
                  alignSelf: "flex-start",
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.25)",
                })}
              >
                <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>
                  Đăng nhập
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Content Wrapper */}
        <View
          style={{
            paddingHorizontal: PROFILE_TOKENS.spacing.screenX,
          }}
        >
          {/* Volunteer Banner */}
          <Pressable
            onPress={() => router.push("/application" as never)}
            accessibilityRole="button"
            accessibilityLabel="Trở thành tình nguyện viên"
            style={{
              marginTop: 20,
              borderRadius: 18,
              backgroundColor: "#ebf3f9",
              paddingHorizontal: 16,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(10, 76, 115, 0.05)",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "#ffffff",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 18 }}>🤝</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "#0a4c73", fontSize: 14, fontWeight: "800" }}>
                Trở thành Tình nguyện viên
              </Text>
              <Text style={{ color: "#5c6b73", fontSize: 11, marginTop: 4 }}>
                Cùng PAW HOME thay đổi cuộc đời thú cưng
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#0a4c73" />
          </Pressable>

          <ProfileSection
            title="TÀI KHOẢN"
            cardColor={cardColor}
            titleColor={sectionTitle}
          >
            <GuestMenuRow
              icon={<Ionicons name="heart-outline" size={16} color="#0a4c73" />}
              label="Danh sách yêu thích"
              badge="5"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/adoption")}
            />
            <GuestMenuRow
              icon={<Ionicons name="notifications-outline" size={16} color="#0a4c73" />}
              label="Thông báo"
              badge="3"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/news")}
            />
            <GuestMenuRow
              icon={<Ionicons name="ribbon-outline" size={16} color="#0a4c73" />}
              label="Lịch sử ủng hộ"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/login")}
              isLast
            />
          </ProfileSection>

          <ProfileSection
            title="HOẠT ĐỘNG"
            cardColor={cardColor}
            titleColor={sectionTitle}
          >
            <GuestMenuRow
              icon={<Ionicons name="people-outline" size={16} color="#0a4c73" />}
              label="Đăng ký tình nguyện viên"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/application" as never)}
            />
            <GuestMenuRow
              icon={<Ionicons name="star-outline" size={16} color="#0a4c73" />}
              label="Đánh giá ứng dụng"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Đánh giá ứng dụng sẽ được triển khai ở bước tiếp theo.",
                )
              }
              isLast
            />
          </ProfileSection>

          <ProfileSection
            title="HỖ TRỢ"
            cardColor={cardColor}
            titleColor={sectionTitle}
          >
            <GuestMenuRow
              icon={<Ionicons name="help-circle-outline" size={16} color="#0a4c73" />}
              label="Câu hỏi thường gặp"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "FAQ sẽ được kết nối nội dung ở bước tiếp theo.",
                )
              }
            />
            <GuestMenuRow
              icon={<Ionicons name="shield-outline" size={16} color="#0a4c73" />}
              label="Chính sách bảo mật"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Chính sách bảo mật sẽ được kết nối ở bước tiếp theo.",
                )
              }
            />
            <GuestMenuRow
              icon={<Ionicons name="call-outline" size={16} color="#0a4c73" />}
              label="Liên hệ chúng tôi"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Kênh liên hệ sẽ được kết nối ở bước tiếp theo.",
                )
              }
              isLast
            />
          </ProfileSection>

          <View
            style={{
              marginTop: PROFILE_TOKENS.spacing.blockGap,
              borderRadius: PROFILE_TOKENS.radius.card,
              backgroundColor: cardColor,
              paddingHorizontal: PROFILE_TOKENS.spacing.cardX,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              ...PROFILE_TOKENS.shadow,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: PROFILE_TOKENS.radius.pill,
                backgroundColor: subtleSurface,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={16}
                color="#0a4c73"
              />
            </View>
            <Text
              style={{
                flex: 1,
                color: textColor,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Thông báo đẩy
            </Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "rgb(210 210 210)", true: "#0a4c73" }}
              thumbColor="white"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập hoặc đăng ký"
            style={{
              marginTop: 18,
              borderRadius: 16,
              backgroundColor: "#0a4c73",
              height: 48,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>
              Đăng nhập / Đăng ký
            </Text>
          </TouchableOpacity>

          <Text style={{
            marginTop: 18,
            textAlign: "center",
            color: mutedColor,
            fontSize: 10,
            fontWeight: "500",
            letterSpacing: 0.5,
          }}>
            PAW HOME v{APP_VERSION} · Made with ❤️
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const LoggedInProfile = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await getCurrentUser();
      return res.data;
    },
  });
  const user = userQuery.data;

  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#232321" },
    "background",
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor(
    { light: "#e9eff4", dark: "rgb(58 58 58)" },
    "icon",
  );
  const subtleSurface = useThemeColor(
    { light: "#e8f2f7", dark: "rgb(42 39 36)" },
    "background",
  );
  const sectionTitle = useThemeColor(
    { light: "#8c9ba5", dark: mutedColor },
    "icon",
  );

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width header */}
        <View
          style={{
            backgroundColor: "#0a4c73",
            paddingTop: insets.top + 20,
            paddingBottom: 24,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                borderWidth: 1.5,
                borderColor: "rgba(255, 255, 255, 0.4)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                overflow: "hidden",
              }}
            >
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person-outline" size={28} color="white" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              {userQuery.isLoading ? (
                <ActivityIndicator size="small" color="white" style={{ alignSelf: "flex-start" }} />
              ) : (
                <>
                  <Text style={{ color: "white", fontSize: 20, fontWeight: "800" }}>
                    {user?.fullName || user?.username || "Chưa đặt tên"}
                  </Text>
                  <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 12, marginTop: 3 }}>
                    {user?.email || "Chưa cập nhật email"}
                  </Text>
                  <View
                    style={{
                      marginTop: 6,
                      alignSelf: "flex-start",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 10, fontWeight: "800" }}>
                      {user?.roles && user.roles.length > 0
                        ? user.roles.join(", ")
                        : "Thành viên"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <View style={{ marginTop: 18, flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
            <ProfileStat value={userQuery.isLoading ? "..." : `${user?.reputation?.score ?? 0}`} label="Điểm uy tín" />
            <ProfileStat value={userQuery.isLoading ? "..." : `${user?.reputation?.level || "Thành viên"}`} label="Cấp độ" />
          </View>
        </View>

        {/* Content Wrapper */}
        <View
          style={{
            paddingHorizontal: PROFILE_TOKENS.spacing.screenX,
          }}
        >
          {/* Reputation Info */}
          <View
            style={{
              marginTop: 16,
              borderRadius: PROFILE_TOKENS.radius.card,
              backgroundColor: cardColor,
              paddingHorizontal: 16,
              paddingVertical: 14,
              ...PROFILE_TOKENS.shadow,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "700", color: textColor }}>
              Điểm uy tín: {user?.reputation?.score ?? 0}
              <Text style={{ color: mutedColor, fontWeight: "500", fontSize: 12 }}>
                {" "}
                | {user?.reputation?.level || "Thành viên"}
              </Text>
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              <InterestChip label="Nuôi chó" color="#0a4c73" />
              <InterestChip label="Nhận nuôi" color="#d46474" />
              <InterestChip label="Mèo nhỏ" color="#1f9bd1" />
              <InterestChip label="Người tin cậy" color="#5fb95c" />
            </View>
          </View>

          <ProfileSection
            title="TÀI KHOẢN"
            cardColor={cardColor}
            titleColor={sectionTitle}
          >
            <GuestMenuRow
              icon={<Ionicons name="notifications-outline" size={16} color="#0a4c73" />}
              label="Đơn nhận nuôi"
              badge="2"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                router.push("/my-adoption" as never)
              }
            />
            <GuestMenuRow
              icon={<Ionicons name="heart-outline" size={16} color="#0a4c73" />}
              label="Lịch sử ủng hộ"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Lịch sử ủng hộ sẽ được kết nối ở bước tiếp theo.",
                )
              }
              isLast
            />
          </ProfileSection>

          <ProfileSection
            title="HOẠT ĐỘNG"
            cardColor={cardColor}
            titleColor={sectionTitle}
          >
            <GuestMenuRow
              icon={<Ionicons name="cash-outline" size={16} color="#0a4c73" />}
              label="Ủng hộ PAW HOME"
              badge="Tặng 1kg"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Luồng ủng hộ sẽ được kết nối ở bước tiếp theo.",
                )
              }
            />
            <GuestMenuRow
              icon={<Ionicons name="paw-outline" size={16} color="#0a4c73" />}
              label="Thú cưng của tôi"
              badge="Xem hết"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/my-pets")}
            />
            <GuestMenuRow
              icon={<Feather name="user-check" size={16} color="#0a4c73" />}
              label="Danh sách bạn bè"
              badge="Mới"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/friends" as never)}
            />
            <GuestMenuRow
              icon={<Ionicons name="document-text-outline" size={16} color="#0a4c73" />}
              label="Đăng ký tình nguyện viên/trung tâm"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() => router.push("/application" as never)}
            />
            <GuestMenuRow
              icon={<Ionicons name="star-outline" size={16} color="#0a4c73" />}
              label="Đánh giá ứng dụng"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Đánh giá ứng dụng sẽ được triển khai ở bước tiếp theo.",
                )
              }
              isLast
            />
          </ProfileSection>

          <ProfileSection
            title="HỖ TRỢ"
            cardColor={cardColor}
            titleColor={sectionTitle}
          >
            <GuestMenuRow
              icon={<Ionicons name="help-circle-outline" size={16} color="#0a4c73" />}
              label="Câu hỏi thường gặp"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "FAQ sẽ được kết nối nội dung ở bước tiếp theo.",
                )
              }
            />
            <GuestMenuRow
              icon={<Ionicons name="shield-outline" size={16} color="#0a4c73" />}
              label="Chính sách bảo mật"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Chính sách bảo mật sẽ được kết nối ở bước tiếp theo.",
                )
              }
            />
            <GuestMenuRow
              icon={<Ionicons name="call-outline" size={16} color="#0a4c73" />}
              label="Liên hệ chúng tôi"
              textColor={textColor}
              mutedColor={mutedColor}
              subtleSurface={subtleSurface}
              borderColor={borderColor}
              onPress={() =>
                Alert.alert(
                  "Thông báo",
                  "Kênh liên hệ sẽ được kết nối ở bước tiếp theo.",
                )
              }
              isLast
            />
          </ProfileSection>

          <View
            style={{
              marginTop: PROFILE_TOKENS.spacing.blockGap,
              borderRadius: PROFILE_TOKENS.radius.card,
              backgroundColor: cardColor,
              paddingHorizontal: PROFILE_TOKENS.spacing.cardX,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              ...PROFILE_TOKENS.shadow,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: PROFILE_TOKENS.radius.pill,
                backgroundColor: subtleSurface,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons
                name="notifications-outline"
                size={16}
                color="#0a4c73"
              />
            </View>
            <Text
              style={{
                flex: 1,
                color: textColor,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Thông báo đẩy
            </Text>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: "rgb(210 210 210)", true: "#0a4c73" }}
              thumbColor="white"
            />
          </View>

          <TouchableOpacity
            onPress={async () => {
              await tokenStorage.clear();
              queryClient.clear();
            }}
            accessibilityRole="button"
            accessibilityLabel="Đăng xuất"
            style={{
              marginTop: 14,
              borderRadius: 16,
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              borderWidth: 1,
              borderColor: "rgba(239, 68, 68, 0.15)",
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#ef4444", fontSize: 14, fontWeight: "700" }}>
              Đăng xuất
            </Text>
          </TouchableOpacity>

          <Text style={{
            marginTop: 18,
            textAlign: "center",
            color: mutedColor,
            fontSize: 10,
            fontWeight: "500",
            letterSpacing: 0.5,
          }}>
            PAW HOME v{APP_VERSION} · Made with ❤️
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, borderRadius: 18, backgroundColor: "rgba(255, 255, 255, 0.15)", paddingVertical: 10, alignItems: "center" }}>
      <Text style={{ color: "#38bdf8", fontSize: 18, fontWeight: "900" }}>{value}</Text>
      <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 11, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function InterestChip({ label, color }: { label: string; color: string }) {
  return (
    <View style={{
      borderRadius: 99,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      paddingHorizontal: 8,
      paddingVertical: 4,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    }}>
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#334155", fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </Text>
    </View>
  );
}

function ProfileSection({
  title,
  titleColor,
  cardColor,
  children,
  ...rest
}: {
  title: string;
  titleColor: string;
  cardColor: string;
  children: ReactNode;
}) {
  return (
    <View style={{ marginTop: PROFILE_TOKENS.spacing.blockGap }}>
      <Text
        style={{
          marginBottom: 8,
          marginLeft: 2,
          color: titleColor,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.8,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          borderRadius: PROFILE_TOKENS.radius.card,
          backgroundColor: cardColor,
          paddingHorizontal: PROFILE_TOKENS.spacing.cardX,
          paddingVertical: 2,
          ...PROFILE_TOKENS.shadow,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function GuestMenuRow({
  icon,
  label,
  textColor,
  mutedColor,
  subtleSurface,
  borderColor,
  badge,
  onPress,
  isLast = false,
}: {
  icon: ReactNode;
  label: string;
  textColor: string;
  mutedColor: string;
  subtleSurface: string;
  borderColor: string;
  badge?: string;
  onPress?: () => void;
  isLast?: boolean;
}) {
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const badgeBg = useThemeColor({ light: "rgba(10, 76, 115, 0.1)", dark: "rgba(41, 182, 246, 0.15)" }, "background");
  const { width } = useWindowDimensions();
  const isCompactLayout = width < 380;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        minHeight: 54,
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
        backgroundColor: pressed ? "rgba(10, 76, 115, 0.04)" : "transparent",
      })}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: PROFILE_TOKENS.radius.pill,
          backgroundColor: subtleSurface,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, { color: primaryColor })
          : icon}
      </View>
      <View
        style={{
          flex: 1,
          minWidth: 0,
          marginRight: 8,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: textColor,
            lineHeight: 20,
            flexShrink: 1,
          }}
          numberOfLines={isCompactLayout ? 2 : 1}
        >
          {label}
        </Text>
        {isCompactLayout && badge ? (
          <View
            style={{
              alignSelf: "flex-start",
              minWidth: 20,
              maxWidth: "100%",
              borderRadius: 10,
              backgroundColor: badgeBg,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              paddingVertical: 3,
              marginTop: 6,
            }}
          >
            <Text
              style={{ color: primaryColor, fontSize: 10, fontWeight: "800" }}
              numberOfLines={1}
            >
              {badge}
            </Text>
          </View>
        ) : null}
      </View>
      {!isCompactLayout && badge ? (
        <View
          style={{
            flexShrink: 0,
            minWidth: 20,
            maxWidth: 96,
            borderRadius: 10,
            backgroundColor: badgeBg,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 8,
            paddingVertical: 3,
            marginRight: 10,
          }}
        >
          <Text style={{ color: primaryColor, fontSize: 10, fontWeight: "800" }} numberOfLines={1}>
            {badge}
          </Text>
        </View>
      ) : null}
      <View style={{ flexShrink: 0, marginLeft: isCompactLayout ? 8 : 0 }}>
        <Ionicons name="chevron-forward" size={16} color={mutedColor} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const status = useSessionBootstrap();
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");

  if (status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "authenticated") {
    return <LoggedInProfile />;
  }

  return <GuestProfile />;
}
