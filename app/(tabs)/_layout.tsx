import { semanticColorValues } from "@/components/ui/gluestack-ui-provider/tokens";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { TouchableOpacity, useColorScheme } from "react-native";
import { HeaderBar } from "@/components/ui/header-bar";

export default function TabLayout() {
  const scheme = useColorScheme();
  const t =
    scheme === "dark" ? semanticColorValues.dark : semanticColorValues.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ options, route }) => (
          <HeaderBar
            title={options.title ?? route.name}
          />
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
          headerShown: false,
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
          href: null,
        }}
      />

      <Tabs.Screen
        name="chat/index"
        options={{
          headerShown: true,
          title: "Trò chuyện",
          tabBarLabel: "Chat",
          header: () => (
            <HeaderBar
              title="Trò chuyện"
              rightSlot={
                <TouchableOpacity
                  onPress={() => router.push("/friends")}
                  accessibilityRole="button"
                  accessibilityLabel="Tìm bạn"
                  style={{
                    height: 36,
                    width: 36,
                    borderRadius: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Ionicons name="people" size={18} color="white" />
                </TouchableOpacity>
              }
            />
          ),
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
          headerShown: false,
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
