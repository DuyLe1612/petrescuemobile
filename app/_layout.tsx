import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "./../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const unstable_settings = {
  anchor: "(tabs)",
};

export const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="system">
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Đăng nhập" }} />
        </Stack>
      </QueryClientProvider>

      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
