import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "./../global.css";

import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

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

    const isInAuthRoute = segments[0] === "login";

    if (status === "authenticated" && isInAuthRoute) {
      router.replace("/(tabs)");
      return;
    }

    if (status === "unauthenticated" && !isInAuthRoute) {
      router.replace("/login");
    }
  }, [router, segments, status]);

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
