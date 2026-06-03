import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSessionBootstrap } from "@/src/presentation/hooks/use-session-bootstrap";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import HomeScreen from "@/src/presentation/screens/HomeScreen";
import AuthenticatedFeedScreen from "@/src/presentation/screens/AuthenticatedFeedScreen";

export default function Index() {
  const status = useSessionBootstrap();
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "tint");

  if (status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor }}>
        <ActivityIndicator color={primaryColor} size="large" />
      </View>
    );
  }

  if (status === "authenticated") {
    return <AuthenticatedFeedScreen />;
  }

  return <HomeScreen />;
}
