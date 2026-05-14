import { MenuItem } from "@/src/presentation/components/profile/MenuItem";
import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import { type ReactNode, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

const PROFILE_TOKENS = {
  spacing: {
    screenX: 20,
    top: 72,
    section: 20,
    blockGap: 14,
    cardX: 16,
  },
  radius: {
    hero: 30,
    card: 24,
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

const GradientHeader = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          style,
          {
            backgroundImage:
              "linear-gradient(135deg, #16545d 0%, #277f8f 52%, #63bcc6 100%)",
          } as ViewStyle,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#16545d", "#277f8f", "#63bcc6"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

const GuestProfile = () => {
  const [pushEnabled, setPushEnabled] = useState(true);

  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const subtleSurface = useThemeColor(
    { light: "rgb(243 242 240)", dark: "rgb(42 39 36)" },
    "background",
  );
  const sectionTitle = useThemeColor({ light: "#a49a91", dark: mutedColor }, "icon");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View
        style={{
          paddingHorizontal: PROFILE_TOKENS.spacing.screenX,
          paddingTop: PROFILE_TOKENS.spacing.top,
        }}
      >
        <GradientHeader
          style={{
            borderRadius: PROFILE_TOKENS.radius.hero,
            paddingHorizontal: 18,
            paddingVertical: 18,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: PROFILE_TOKENS.radius.pill,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.45)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
              }}
            >
              <Feather name="user" size={22} color="rgb(246 252 252)" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 24, fontWeight: "800" }}>Khách</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 4 }}>
                Đăng nhập để sử dụng đầy đủ
              </Text>
              <Pressable
                onPress={() => router.push("/login")}
                accessibilityRole="button"
                accessibilityLabel="Đăng nhập"
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  backgroundColor: "#ff9f43",
                  borderRadius: PROFILE_TOKENS.radius.pill,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>Đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </GradientHeader>

        <Pressable
          onPress={() =>
            Alert.alert("Thông báo", "Tính năng tình nguyện viên sẽ được kết nối ở bước tiếp theo.")
          }
          accessibilityRole="button"
          accessibilityLabel="Trở thành tình nguyện viên"
          style={{
            marginTop: PROFILE_TOKENS.spacing.section,
            borderRadius: PROFILE_TOKENS.radius.card,
            backgroundColor: "rgba(39,127,143,0.12)",
            paddingHorizontal: 16,
            paddingVertical: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: PROFILE_TOKENS.radius.pill,
              backgroundColor: "rgba(255,255,255,0.7)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 18 }}>🤝</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textColor, fontSize: 14, fontWeight: "700" }}>
              Trở thành Tình nguyện viên
            </Text>
            <Text style={{ color: mutedColor, fontSize: 12, marginTop: 3 }}>
              Cùng HPA thay đổi cuộc đời thú cưng
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={primaryColor} />
        </Pressable>

        <ProfileSection
          title="TÀI KHOẢN"
          cardColor={cardColor}
          titleColor={sectionTitle}
        >
          <GuestMenuRow
            icon={<Ionicons name="heart-outline" size={16} color={primaryColor} />}
            label="Danh sách yêu thích"
            badge="8"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/login")}
          />
          <GuestMenuRow
            icon={<Ionicons name="notifications-outline" size={16} color={primaryColor} />}
            label="Thông báo"
            badge="3"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/login")}
          />
          <GuestMenuRow
            icon={<MaterialCommunityIcons name="hand-heart-outline" size={16} color={primaryColor} />}
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
            icon={<Feather name="users" size={16} color={primaryColor} />}
            label="Đăng ký tình nguyện viên"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Mục này sẽ được kết nối nội dung ở bước tiếp theo.")
            }
          />
          <GuestMenuRow
            icon={<Feather name="star" size={16} color={primaryColor} />}
            label="Đánh giá ứng dụng"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Đánh giá ứng dụng sẽ được triển khai ở bước tiếp theo.")
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
            icon={<Feather name="help-circle" size={16} color={primaryColor} />}
            label="Câu hỏi thường gặp"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "FAQ sẽ được kết nối nội dung ở bước tiếp theo.")
            }
          />
          <GuestMenuRow
            icon={<Feather name="info" size={16} color={primaryColor} />}
            label="Chính sách bảo mật"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Chính sách bảo mật sẽ được kết nối ở bước tiếp theo.")
            }
          />
          <GuestMenuRow
            icon={<Feather name="phone-call" size={16} color={primaryColor} />}
            label="Liên hệ chúng tôi"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Kênh liên hệ sẽ được kết nối ở bước tiếp theo.")
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
            <Ionicons name="notifications-outline" size={16} color={primaryColor} />
          </View>
          <Text style={{ flex: 1, color: textColor, fontSize: 14, fontWeight: "600" }}>
            Thông báo đẩy
          </Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: "rgb(210 210 210)", true: primaryColor }}
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
            backgroundColor: primaryColor,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "rgb(246 252 252)", fontSize: 15, fontWeight: "800" }}>
            Đăng nhập / Đăng ký
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginTop: 18,
            textAlign: "center",
            color: mutedColor,
            fontSize: 11,
          }}
        >
          Hanoi Pet Adoption v{APP_VERSION} - Made with love
        </Text>
      </View>
    </ScrollView>
  );
};

const LoggedInProfile = () => {
  const [pushEnabled, setPushEnabled] = useState(true);

  const primaryColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");
  const subtleSurface = useThemeColor(
    { light: "rgb(243 242 240)", dark: "rgb(42 39 36)" },
    "background",
  );
  const sectionTitle = useThemeColor({ light: "#a49a91", dark: mutedColor }, "icon");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View
        style={{
          paddingHorizontal: PROFILE_TOKENS.spacing.screenX,
          paddingTop: PROFILE_TOKENS.spacing.top,
        }}
      >
        <GradientHeader
          style={{
            borderRadius: PROFILE_TOKENS.radius.hero,
            paddingHorizontal: 18,
            paddingTop: 18,
            paddingBottom: 92,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: PROFILE_TOKENS.radius.pill,
                backgroundColor: "rgba(255,255,255,0.18)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Feather name="user" size={21} color="rgb(246 252 252)" />
            </View>
            <View className="flex-1">
              <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                Nguyễn Văn An
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 12, marginTop: 2 }}>
                nguyenvana@example.com
              </Text>
              <Text style={{ color: "#ffb36a", fontSize: 11, marginTop: 3, fontWeight: "700" }}>
                Người dùng
              </Text>
            </View>
          </View>

          <View
            style={{
              marginTop: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <ProfileStat value="3" label="Lượt cứu hộ" />
            <ProfileStat value="5" label="Bài đăng" />
            <ProfileStat value="8" label="Quan tâm" />
          </View>
        </GradientHeader>

        <View
          style={{
            marginTop: -58,
            borderRadius: PROFILE_TOKENS.radius.card,
            backgroundColor: cardColor,
            paddingHorizontal: 14,
            paddingVertical: 14,
            ...PROFILE_TOKENS.shadow,
          }}
        >
          <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>
            Điểm uy tín: 340+
            <Text style={{ color: mutedColor, fontWeight: "500" }}> | Tình nguyện viên</Text>
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            <InterestChip label="Nuôi chó" color="#ff8c38" />
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
            icon={<Ionicons name="heart-outline" size={16} color={primaryColor} />}
            label="Danh sách yêu thích"
            badge="3"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Danh sách yêu thích sẽ được kết nối ở bước tiếp theo.")
            }
          />
          <GuestMenuRow
            icon={<Ionicons name="notifications-outline" size={16} color={primaryColor} />}
            label="Thông báo"
            badge="2"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Danh sách thông báo sẽ được kết nối ở bước tiếp theo.")
            }
          />
          <GuestMenuRow
            icon={<MaterialCommunityIcons name="hand-heart-outline" size={16} color={primaryColor} />}
            label="Lịch sử ủng hộ"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert("Thông báo", "Lịch sử ủng hộ sẽ được kết nối ở bước tiếp theo.")
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
            icon={<MaterialCommunityIcons name="hand-coin-outline" size={16} color="#ff8c38" />}
            label="Ủng hộ HPA"
            badge="Tặng 1kg"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => Alert.alert("Thông báo", "Luồng ủng hộ sẽ được kết nối ở bước tiếp theo.")}
          />
          <GuestMenuRow
            icon={<Feather name="users" size={16} color="#44b882" />}
            label="Thú cưng của tôi"
            badge="Corgi 1"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/my-pets/index")}
          />
          <GuestMenuRow
            icon={<Ionicons name="document-text-outline" size={16} color={primaryColor} />}
            label="Đăng ký tình nguyện viên/trung tâm"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => Alert.alert("Thông báo", "Mục đăng ký sẽ được kết nối ở bước tiếp theo.")}
          />
          <GuestMenuRow
            icon={<Feather name="star" size={16} color={primaryColor} />}
            label="Đánh giá ứng dụng"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => Alert.alert("Thông báo", "Đánh giá ứng dụng sẽ được triển khai ở bước tiếp theo.")}
            isLast
          />
        </ProfileSection>

        <ProfileSection
          title="HỖ TRỢ"
          cardColor={cardColor}
          titleColor={sectionTitle}
        >
          <GuestMenuRow
            icon={<Feather name="help-circle" size={16} color={primaryColor} />}
            label="Câu hỏi thường gặp"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => Alert.alert("Thông báo", "FAQ sẽ được kết nối nội dung ở bước tiếp theo.")}
          />
          <GuestMenuRow
            icon={<Feather name="info" size={16} color={primaryColor} />}
            label="Chính sách bảo mật"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => Alert.alert("Thông báo", "Chính sách bảo mật sẽ được kết nối ở bước tiếp theo.")}
          />
          <GuestMenuRow
            icon={<Feather name="phone-call" size={16} color={primaryColor} />}
            label="Liên hệ chúng tôi"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => Alert.alert("Thông báo", "Kênh liên hệ sẽ được kết nối ở bước tiếp theo.")}
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
            <Ionicons name="notifications-outline" size={16} color={primaryColor} />
          </View>
          <Text style={{ flex: 1, color: textColor, fontSize: 14, fontWeight: "600" }}>
            Thông báo đẩy
          </Text>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: "rgb(210 210 210)", true: primaryColor }}
            thumbColor="white"
          />
        </View>

        <TouchableOpacity
          onPress={async () => {
            await tokenStorage.clear();
          }}
          accessibilityRole="button"
          accessibilityLabel="Đăng xuất"
          style={{
            marginTop: 14,
            borderRadius: 16,
            backgroundColor: "rgba(218,65,47,0.10)",
            borderWidth: 1,
            borderColor: "rgba(218,65,47,0.18)",
            height: 46,
            paddingHorizontal: 16,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "rgb(218 65 47)", fontSize: 14, fontWeight: "700" }}>
            Đăng xuất
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            marginTop: 16,
            textAlign: "center",
            color: mutedColor,
            fontSize: 11,
          }}
        >
          Hanoi Pet Adoption v{APP_VERSION} - Made with love
        </Text>
      </View>
    </ScrollView>
  );
};

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.16)",
        paddingVertical: 10,
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#ffb36a", fontSize: 18, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: "rgba(255,255,255,0.82)", fontSize: 11, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function InterestChip({ label, color }: { label: string; color: string }) {
  return (
    <View
      style={{
        borderRadius: PROFILE_TOKENS.radius.pill,
        backgroundColor: "rgba(255,255,255,0.9)",
        paddingHorizontal: 9,
        paddingVertical: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: PROFILE_TOKENS.radius.pill,
          backgroundColor: color,
          marginRight: 6,
        }}
      />
      <Text style={{ color: "#344054", fontSize: 11, fontWeight: "600" }}>{label}</Text>
    </View>
  );
}

function ProfileSection({
  title,
  titleColor,
  cardColor,
  children,
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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
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
        {icon}
      </View>
      <Text style={{ flex: 1, color: textColor, fontSize: 14, fontWeight: "600" }}>{label}</Text>
      {badge ? (
        <View
          style={{
            minWidth: 18,
            height: 18,
            borderRadius: PROFILE_TOKENS.radius.pill,
            backgroundColor: "#ff9f43",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 5,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 10, fontWeight: "700" }}>{badge}</Text>
        </View>
      ) : null}
      <Feather name="chevron-right" size={16} color={mutedColor} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const status = useSessionBootstrap();

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "authenticated") {
    return <LoggedInProfile />;
  }

  return <GuestProfile />;
}
