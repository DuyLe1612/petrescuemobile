import { semanticColorValues } from "@/components/ui/gluestack-ui-provider/tokens";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";

export default function TabLayout() {
  const scheme = useColorScheme();
  const t =
    scheme === "dark" ? semanticColorValues.dark : semanticColorValues.light;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: t.background },
        headerTintColor: t.foreground,
        headerShadowVisible: false,
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/search-users" as never)}
            style={{ marginRight: 16 }}
          >
            <Feather name="search" size={22} color={t.foreground} />
          </TouchableOpacity>
        ),

        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.mutedForeground,

        tabBarStyle: {
          backgroundColor: t.background,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: t.border,
          elevation: 10,
          shadowOpacity: 0.08,
          shadowRadius: 10,

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
          title: "trang chủ",
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
          title: "Thong bao",
          tabBarLabel: "Thong bao",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
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
