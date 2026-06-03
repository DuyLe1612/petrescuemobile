import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle?: string | null;
  onBack?: () => void;
  rightSlot?: React.ReactNode;
  className?: string;
};

import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HeaderBar: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  rightSlot,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: "#0a4c73",
        paddingTop: insets.top + 16,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            style={({ pressed }) => ({
              height: 36,
              width: 36,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: pressed
                ? "rgba(255, 255, 255, 0.25)"
                : "rgba(255, 255, 255, 0.15)",
            })}
          >
            <Ionicons name="chevron-back" size={18} color="white" />
          </Pressable>
        ) : null}

        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "800", letterSpacing: -0.2 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11, marginTop: 2 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightSlot ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", paddingLeft: 8 }}>
          {rightSlot}
        </View>
      ) : null}
    </View>
  );
};

export default HeaderBar;
