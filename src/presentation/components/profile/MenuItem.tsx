import { Feather } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";

const AndroidFeedback = ({
  children,
  onPress,
  label,
}: {
  children: ReactNode;
  onPress?: () => void;
  label: string;
}) => {
  return (
    <View
      className="overflow-hidden rounded-2xl"
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <TouchableNativeFeedback onPress={onPress} useForeground>
        <View>{children}</View>
      </TouchableNativeFeedback>
    </View>
  );
};

export const MenuItem = ({
  icon,
  label,
  description,
  onPress,
}: {
  icon: ReactNode;
  label: string;
  description?: string;
  onPress?: () => void;
}) => {
  const content = (
    <View className="min-h-14 flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-muted">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
        {description ? (
          <Text className="mt-1 text-xs text-muted-foreground">{description}</Text>
        ) : null}
      </View>
      <Feather name="chevron-right" size={18} color="#8a8179" />
    </View>
  );

  if (Platform.OS === "android") {
    return (
      <AndroidFeedback onPress={onPress} label={label}>
        {content}
      </AndroidFeedback>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {content}
    </TouchableOpacity>
  );
};
