import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

export const APPLICATION_TOKENS = {
  spacing: {
    screenX: 20,
    top: 16,
    section: 18,
    cardX: 16,
  },
  radius: {
    hero: 28,
    card: 24,
    field: 16,
    pill: 999,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

export function SectionCaption({ label }: { label: string }) {
  const mutedColor = useThemeColor({}, "icon");

  return (
    <Text
      style={{
        color: mutedColor,
        fontSize: 12,
        fontWeight: "800",
        marginTop: APPLICATION_TOKENS.spacing.section,
        marginBottom: 10,
      }}
    >
      {label}
    </Text>
  );
}

export function SelectionPill({
  label,
  selected,
  color,
  onPress,
}: {
  label: string;
  selected: boolean;
  color: string;
  onPress: () => void;
}) {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: APPLICATION_TOKENS.radius.pill,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: selected ? color : borderColor,
        backgroundColor: selected ? `${color}18` : "transparent",
      }}
    >
      <Text style={{ color: selected ? color : textColor, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

export function OptionCard({
  title,
  description,
  icon,
  accent,
  selected,
  onPress,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
  selected: boolean;
  onPress: () => void;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: APPLICATION_TOKENS.radius.card,
        borderWidth: 1,
        borderColor: selected ? accent : borderColor,
        backgroundColor: selected ? `${accent}14` : "transparent",
        padding: 14,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: APPLICATION_TOKENS.radius.field,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${accent}18`,
        }}
      >
        {icon}
      </View>

      <Text style={{ color: textColor, fontSize: 15, fontWeight: "800", marginTop: 12 }}>{title}</Text>
      <Text style={{ color: mutedColor, fontSize: 12, lineHeight: 19, marginTop: 6 }}>{description}</Text>
    </Pressable>
  );
}

export function StatPill({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View
      style={{
        flex: 1,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.88)",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <Text style={{ color: accent, fontSize: 18, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: mutedColor, fontSize: 11, marginTop: 4 }}>{label}</Text>
    </View>
  );
}
