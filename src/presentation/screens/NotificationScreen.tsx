import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, ScrollView, StatusBar, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NOTIFICATION_TOKENS = {
  spacing: {
    screenX: 20,
    top: 68,
    section: 22,
  },
  radius: {
    hero: 30,
    card: 22,
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

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  dotColor: string;
  iconBg: string;
  iconColor: string;
  icon:
    | { set: "ion"; name: React.ComponentProps<typeof Ionicons>["name"] }
    | { set: "feather"; name: React.ComponentProps<typeof Feather>["name"] }
    | {
        set: "material";
        name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
      };
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "urgent-rescue",
    title: "Ca cứu hộ mới gần bạn!",
    message: "Chó bị thương tại Đống Đa - cần TNV hỗ trợ trong 2 giờ.",
    time: "5 phút trước",
    isUnread: true,
    dotColor: "#ff6f61",
    iconBg: "rgba(255,111,97,0.14)",
    iconColor: "#ff6f61",
    icon: { set: "material", name: "ambulance" },
  },
  {
    id: "comment",
    title: "Nguyễn Hà Linh bình luận",
    message: "\"TNV khu vực Hoàng Mai sẽ tuần tra tìm bé hôm nay!\"",
    time: "15 phút trước",
    isUnread: true,
    dotColor: "#2ea7ff",
    iconBg: "rgba(46,167,255,0.14)",
    iconColor: "#2ea7ff",
    icon: { set: "ion", name: "chatbubble-ellipses-outline" },
  },
  {
    id: "like",
    title: "Bài viết của bạn được 47 lượt thích",
    message: "Bài đăng về bé mèo thất lạc Nhem đang được lan truyền!",
    time: "1 giờ trước",
    isUnread: true,
    dotColor: "#38bdf8",
    iconBg: "rgba(56,189,248,0.14)",
    iconColor: "#38bdf8",
    icon: { set: "ion", name: "heart-outline" },
  },
  {
    id: "vaccine",
    title: "Nhắc lịch tiêm phòng",
    message: "Cà Phê cần tiêm vaccine nhắc lại vào 01/12/2026. Đặt lịch ngay!",
    time: "3 giờ trước",
    isUnread: false,
    dotColor: "#a49a91",
    iconBg: "rgba(39,127,143,0.10)",
    iconColor: "#277f8f",
    icon: { set: "feather", name: "shield" },
  },
  {
    id: "badge",
    title: "Bạn đạt danh hiệu \"Uy tín\"",
    message: "Điểm uy tín đạt 340. Tiếp tục hoạt động để trở thành TNV!",
    time: "1 ngày trước",
    isUnread: false,
    dotColor: "#a49a91",
    iconBg: "rgba(95,185,92,0.14)",
    iconColor: "#44b882",
    icon: { set: "material", name: "medal-outline" },
  },
  {
    id: "rescue-done",
    title: "Ca cứu hộ hoàn thành!",
    message: "Bé mèo cam tại Tây Hồ đã được đưa về PAW HOME Trạm Tây Hồ an toàn.",
    time: "2 ngày trước",
    isUnread: false,
    dotColor: "#a49a91",
    iconBg: "rgba(68,184,130,0.14)",
    iconColor: "#44b882",
    icon: { set: "ion", name: "checkmark-done-circle-outline" },
  },
];

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({ light: "#f6f8fc", dark: "#121212" }, "background");
  const primaryColor = useThemeColor({ light: "#0a4c73", dark: "#29b6f6" }, "tint");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "#e9eff4", dark: "rgb(58 58 58)" }, "icon");

  const unreadItems = NOTIFICATIONS.filter((item) => item.isUnread);
  const readItems = NOTIFICATIONS.filter((item) => !item.isUnread);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 24, 32),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-width header */}
        <View
          style={{
            backgroundColor: "#0a4c73",
            paddingTop: insets.top + 20,
            paddingBottom: 20,
            paddingHorizontal: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                  return;
                }

                router.replace("/");
              }}
              accessibilityRole="button"
              accessibilityLabel="Quay lại"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                marginRight: 12,
              }}
            >
              <Feather name="chevron-left" size={20} color="white" />
            </Pressable>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 19, marginRight: 8 }}>🔔</Text>
                <Text style={{ color: "white", fontSize: 26, fontWeight: "800" }}>Thông báo</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Đọc tất cả"
              style={{
                borderRadius: 999,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
                Đọc tất cả
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              marginTop: 14,
              alignSelf: "flex-start",
              borderRadius: 999,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: "#38bdf8",
                marginRight: 7,
              }}
            />
            <Text style={{ color: "white", fontSize: 12, fontWeight: "700" }}>
              {unreadItems.length} thông báo chưa đọc
            </Text>
          </View>
        </View>

        {/* Content Wrapper */}
        <View
          style={{
            paddingHorizontal: NOTIFICATION_TOKENS.spacing.screenX,
          }}
        >
          <SectionLabel label="CHƯA ĐỌC" color={mutedColor} />
          <View
            style={{
              borderRadius: NOTIFICATION_TOKENS.radius.card,
              backgroundColor: cardColor,
              overflow: "hidden",
              ...NOTIFICATION_TOKENS.shadow,
            }}
          >
            {unreadItems.map((item, index) => (
              <NotificationCard
                key={item.id}
                item={item}
                textColor={textColor}
                mutedColor={mutedColor}
                borderColor={borderColor}
                isLast={index === unreadItems.length - 1}
              />
            ))}
          </View>

          <SectionLabel label="ĐÃ ĐỌC" color={mutedColor} />
          <View
            style={{
              borderRadius: NOTIFICATION_TOKENS.radius.card,
              backgroundColor: cardColor,
              overflow: "hidden",
              ...NOTIFICATION_TOKENS.shadow,
            }}
          >
            {readItems.map((item, index) => (
              <NotificationCard
                key={item.id}
                item={item}
                textColor={textColor}
                mutedColor={mutedColor}
                borderColor={borderColor}
                isLast={index === readItems.length - 1}
              />
            ))}
          </View>

          <View
            style={{
              marginTop: 16,
              borderRadius: NOTIFICATION_TOKENS.radius.card,
              backgroundColor: cardColor,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              ...NOTIFICATION_TOKENS.shadow,
            }}
          >
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: NOTIFICATION_TOKENS.radius.pill,
                backgroundColor: "rgba(39,127,143,0.10)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <Ionicons name="notifications-outline" size={17} color="#0a4c73" />
            </View>
            <Text style={{ flex: 1, color: textColor, fontSize: 14, fontWeight: "700" }}>
              Thông báo đẩy
            </Text>
            <Switch
              value
              trackColor={{ false: "rgb(210 210 210)", true: "#0a4c73" }}
              thumbColor="white"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <Text
      style={{
        color,
        fontSize: 12,
        fontWeight: "800",
        marginTop: NOTIFICATION_TOKENS.spacing.section,
        marginBottom: 10,
      }}
    >
      {label}
    </Text>
  );
}

function NotificationCard({
  item,
  textColor,
  mutedColor,
  borderColor,
  isLast,
}: {
  item: NotificationItem;
  textColor: string;
  mutedColor: string;
  borderColor: string;
  isLast: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: NOTIFICATION_TOKENS.radius.pill,
          backgroundColor: item.iconBg,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <NotificationIcon item={item} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ flex: 1, color: textColor, fontSize: 16, fontWeight: "800" }}>
            {item.title}
          </Text>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: NOTIFICATION_TOKENS.radius.pill,
              backgroundColor: item.dotColor,
              marginRight: 6,
            }}
          />
          <Text style={{ color: mutedColor, fontSize: 11, fontWeight: "600" }}>{item.time}</Text>
        </View>

        <Text style={{ color: mutedColor, fontSize: 14, lineHeight: 21, marginTop: 6 }}>
          {item.message}
        </Text>
      </View>
    </Pressable>
  );
}

function NotificationIcon({ item }: { item: NotificationItem }) {
  if (item.icon.set === "ion") {
    return <Ionicons name={item.icon.name} size={18} color={item.iconColor} />;
  }

  if (item.icon.set === "feather") {
    return <Feather name={item.icon.name} size={18} color={item.iconColor} />;
  }

  return <MaterialCommunityIcons name={item.icon.name} size={18} color={item.iconColor} />;
}
