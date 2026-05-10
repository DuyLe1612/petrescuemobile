import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

// Nếu bạn đã có hook useColorScheme trong src/presentation/hooks thì dùng cái đó cũng được.
// import { useColorScheme } from "@/src/presentation/hooks/use-color-scheme";

const THEME = {
  light: {
    headerBg: "rgb(255 255 255)",
    headerText: "rgb(23 23 23)",

    tabBg: "rgb(255 255 255)",
    tabActive: "rgb(38 38 38)", // --primary
    tabInactive: "rgb(125 125 125)", // --muted-foreground
  },
  dark: {
    headerBg: "rgb(23 23 23)",
    headerText: "rgb(252 252 252)",

    tabBg: "rgb(23 23 23)",
    tabActive: "rgb(252 252 252)", // --primary (dark)
    tabInactive: "rgb(176 176 176)", // --muted-foreground (dark)
  },
};

export default function TabLayout() {
  const scheme = useColorScheme();
  const t = scheme === "dark" ? THEME.dark : THEME.light;

  return (
    <Tabs
      screenOptions={{
        // Header: vẫn là style object, nhưng màu theo theme tokens
        headerStyle: { backgroundColor: t.headerBg },
        headerTintColor: t.headerText,
        headerShadowVisible: false,

        // Tint icon/label theo semantic tokens
        tabBarActiveTintColor: t.tabActive,
        tabBarInactiveTintColor: t.tabInactive,

        // Tab bar: phần “shape” vẫn là style object,
        // còn layout spacing có thể chuyển bớt sang className nếu bạn tự render tabBar.
        tabBarStyle: {
          backgroundColor: t.tabBg,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.08,
          shadowRadius: 10,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          position: "absolute",
          overflow: "hidden",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },

        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarLabel: "Trang chủ",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="adoption"
        options={{
          title: "Tìm bé",
          tabBarLabel: "Tìm bé",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Bản đồ",
          tabBarLabel: "Bản đồ",
          tabBarIcon: ({ color, size }) => (
            <Feather name="map" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="news"
        options={{
          title: "Tin tức",
          tabBarLabel: "Tin tức",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "newspaper" : "newspaper-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Tôi",
          tabBarLabel: "Tôi",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
