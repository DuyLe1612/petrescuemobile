import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import "./../global.css";

export const unstable_settings = {
  anchor: "(tabs)",
};

export const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const status = useSessionBootstrap();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    const route = segments[0];
    const isInAuthRoute = route === "login" || route === "register";

    if (status === "authenticated" && isInAuthRoute) {
      router.replace("/(tabs)/profile");
    }
  }, [router, segments, status]);

  return (
    <GluestackUIProvider mode="system">
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Đăng nhập" }} />
          <Stack.Screen name="register" options={{ title: "Đăng ký" }} />
          <Stack.Screen name="pet/[id]" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>

      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
