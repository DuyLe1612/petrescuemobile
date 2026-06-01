import { tokenStorage } from "@/src/infrastructure/storage/token-storage";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { type ReactNode, useState } from "react";
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
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#232321" },
    "background",
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor(
    { light: "rgb(233 230 227)", dark: "rgb(58 58 58)" },
    "icon",
  );
  const subtleSurface = useThemeColor(
    { light: "rgb(243 242 240)", dark: "rgb(42 39 36)" },
    "background",
  );
  const sectionTitle = useThemeColor(
    { light: "#a49a91", dark: mutedColor },
    "icon",
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
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
          <View className="flex-row items-center">
            <View className="h-12 w-12 rounded-full border border-white/45 items-center justify-center mr-3.5 bg-white/10">
              <Ionicons name="person" size={20} color="white" />
            </View>

            <View className="flex-1">
              <Text className="text-white text-2xl font-black">Khách</Text>
              <Text className="text-white/80 text-xs mt-1">Đăng nhập để sử dụng đầy đủ</Text>
              <Pressable
                onPress={() => router.push("/login")}
                accessibilityRole="button"
                accessibilityLabel="Đăng nhập"
                className="mt-2.5 self-start bg-orange-400 rounded-full px-3.5 py-1.5 active:opacity-90"
              >
                <Text className="text-white text-xs font-bold">Đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </GradientHeader>

        <Pressable
          onPress={() => router.push("/application" as never)}
          accessibilityRole="button"
          accessibilityLabel="Trở thành tình nguyện viên"
          className="mt-5 rounded-2xl bg-primary/10 px-4 py-4 flex-row items-center active:opacity-90"
        >
          <View className="h-10 w-10 rounded-full bg-white/80 items-center justify-center mr-3 shadow-sm">
            <Text className="text-lg">🤝</Text>
          </View>
          <View className="flex-1">
            <Text className="text-foreground text-sm font-bold">
              Trở thành Tình nguyện viên
            </Text>
            <Text className="text-muted-foreground text-xs mt-1">
              Cùng HPA thay đổi cuộc đời thú cưng
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={primaryColor} />
        </Pressable>

        <ProfileSection
          title="TÀI KHOẢN"
          cardColor={cardColor}
          titleColor={sectionTitle}
        >
          <GuestMenuRow
            icon={<Ionicons name="notifications-outline" size={16} color={primaryColor} />}
            label="Thông báo"
            badge="3"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/news")}
          />
          <GuestMenuRow
            icon={<Ionicons name="heart-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="people-outline" size={16} color={primaryColor} />}
            label="Đăng ký tình nguyện viên"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/application" as never)}
          />
          <GuestMenuRow
            icon={<Ionicons name="star-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="help-circle-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="information-circle-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="call-outline" size={16} color={primaryColor} />}
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
              color={primaryColor}
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
            trackColor={{ false: "rgb(210 210 210)", true: primaryColor }}
            thumbColor="white"
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/login")}
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập hoặc đăng ký"
          className="mt-[18px] rounded-2xl bg-primary h-12 items-center justify-center active:opacity-90"
        >
          <Text className="text-white text-sm font-black">
            Đăng nhập / Đăng ký
          </Text>
        </TouchableOpacity>

        <Text className="mt-[18px] text-center text-muted-foreground text-[10px] font-medium tracking-wide">
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
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#232321" },
    "background",
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor(
    { light: "rgb(233 230 227)", dark: "rgb(58 58 58)" },
    "icon",
  );
  const subtleSurface = useThemeColor(
    { light: "rgb(243 242 240)", dark: "rgb(42 39 36)" },
    "background",
  );
  const sectionTitle = useThemeColor(
    { light: "#a49a91", dark: mutedColor },
    "icon",
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
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
          <View className="flex-row items-center">
            <View className="h-12 w-12 rounded-full items-center justify-center mr-3 bg-white/20">
              <Ionicons name="person" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-lg font-black">
                Nguyễn Văn An
              </Text>
              <Text className="text-white/80 text-xs mt-0.5">
                nguyenvana@example.com
              </Text>
              <Text className="text-orange-300 text-[10px] mt-1 font-bold">
                Người dùng
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row justify-between gap-2.5">
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
          <Text className="text-sm font-bold text-foreground">
            Điểm uy tín: 340+
            <Text className="text-muted-foreground font-medium text-xs">
              {" "}
              | Tình nguyện viên
            </Text>
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-2.5">
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
            icon={<Ionicons name="notifications-outline" size={16} color={primaryColor} />}
            label="Thông báo"
            badge="2"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() =>
              Alert.alert(
                "Thông báo",
                "Danh sách thông báo sẽ được kết nối ở bước tiếp theo.",
              )
            }
          />
          <GuestMenuRow
            icon={<Ionicons name="heart-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="cash-outline" size={16} color="#ff8c38" />}
            label="Ủng hộ HPA"
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
            icon={<Ionicons name="paw-outline" size={16} color="#44b882" />}
            label="Thú cưng của tôi"
            badge="Corgi 1"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/my-pets")}
          />
          <GuestMenuRow
            icon={<Feather name="user-check" size={16} color="#1f9bd1" />}
            label="Danh sách bạn bè"
            badge="Mới"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/friends" as never)}
          />
          <GuestMenuRow
            icon={
              <Ionicons
                name="document-text-outline"
                size={16}
                color={primaryColor}
              />
            }
            label="Đăng ký tình nguyện viên/trung tâm"
            textColor={textColor}
            mutedColor={mutedColor}
            subtleSurface={subtleSurface}
            borderColor={borderColor}
            onPress={() => router.push("/application" as never)}
          />
          <GuestMenuRow
            icon={<Ionicons name="star-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="help-circle-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="information-circle-outline" size={16} color={primaryColor} />}
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
            icon={<Ionicons name="call-outline" size={16} color={primaryColor} />}
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
              color={primaryColor}
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
          className="mt-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 h-11 px-4 items-start justify-center active:opacity-90"
        >
          <Text className="text-red-500 text-sm font-bold">Đăng xuất</Text>
        </TouchableOpacity>

        <Text className="mt-4 text-center text-muted-foreground text-[10px] font-medium tracking-wide">
          Hanoi Pet Adoption v{APP_VERSION} - Made with love
        </Text>
      </View>
    </ScrollView>
  );
};

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 rounded-[18px] bg-white/15 py-2.5 items-center">
      <Text className="text-orange-300 text-lg font-black">{value}</Text>
      <Text className="text-white/80 text-[11px] mt-0.5">{label}</Text>
    </View>
  );
}

function InterestChip({ label, color }: { label: string; color: string }) {
  return (
    <View className="rounded-full bg-white/90 px-2 py-1 flex-row items-center shadow-sm">
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 99,
          backgroundColor: color,
          marginRight: 6,
        }}
      />
      <Text className="text-slate-700 text-[10px] font-bold uppercase tracking-wider">{label}</Text>
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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="flex-row items-center active:bg-muted/10"
      style={{
        minHeight: 54,
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
      <Text className="flex-1 text-sm font-semibold" style={{ color: textColor }}>
        {label}
      </Text>
      {badge ? (
        <View className="min-w-[18px] h-[18px] rounded-full bg-orange-400 items-center justify-center px-1.5 mr-2.5">
          <Text className="text-white text-[10px] font-bold">{badge}</Text>
        </View>
      ) : null}
      <Ionicons name="chevron-forward" size={16} color={mutedColor} />
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
