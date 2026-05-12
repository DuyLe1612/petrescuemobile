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

export const HeaderBar: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  rightSlot,
  className = "",
}) => {
  return (
    <View
      className={`flex-row items-center justify-between py-3 bg-background border-b border-border/40 ${className}`}
    >
      <View className="flex-1 flex-row items-center gap-3">
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            className="h-10 w-10 items-center justify-center rounded-full bg-muted/60 active:bg-muted"
          >
            <Ionicons name="chevron-back" size={22} className="text-foreground" />
          </Pressable>
        ) : null}

        <View className="flex-1 justify-center">
          <Text className="text-xl font-extrabold text-foreground tracking-tight leading-7">
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-xs text-muted-foreground mt-0.5 leading-4">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightSlot ? (
        <View className="flex-row items-center justify-end pl-2">
          {rightSlot}
        </View>
      ) : null}
    </View>
  );
};

export default HeaderBar;
