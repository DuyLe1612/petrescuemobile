import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { HeaderBar } from "@/components/ui/header-bar";

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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen
            name="login"
            options={{
              headerShown: true,
              header: ({ navigation }) => (
                <HeaderBar
                  title="Đăng nhập"
                  onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
                />
              ),
            }}
          />
          <Stack.Screen
            name="register"
            options={{
              headerShown: true,
              header: ({ navigation }) => (
                <HeaderBar
                  title="Đăng ký"
                  onBack={navigation.canGoBack() ? () => navigation.goBack() : undefined}
                />
              ),
            }}
          />
          <Stack.Screen name="application/index" />
          <Stack.Screen name="application/form" />
          <Stack.Screen name="application/success" />
          <Stack.Screen name="my-pets/index" />
          <Stack.Screen name="my-pets/create" />
          <Stack.Screen name="my-pets/create-success" />
          <Stack.Screen name="my-pets/[id]" />
          <Stack.Screen name="my-pets/[id]/edit" />
          <Stack.Screen name="my-pets/[id]/diary" />
          <Stack.Screen name="pet/[id]" />
          <Stack.Screen name="post/create" />
          <Stack.Screen name="post/[id]" />
        </Stack>
      </QueryClientProvider>

      <StatusBar style="auto" />
    </GluestackUIProvider>
  );
}
