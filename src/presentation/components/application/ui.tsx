import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { Feather } from "@expo/vector-icons";
import { type ReactNode } from "react";
import { Pressable, Text, TextInput, View, type TextInputProps, type ViewStyle } from "react-native";

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

export function ApplicationTopBar({
  title,
  subtitle,
  onBack,
  backIcon = "chevron-left",
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  backIcon?: React.ComponentProps<typeof Feather>["name"];
  rightSlot?: ReactNode;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        style={{
          width: 36,
          height: 36,
          borderRadius: APPLICATION_TOKENS.radius.pill,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(39,127,143,0.10)",
        }}
      >
        <Feather name={backIcon} size={18} color={textColor} />
      </Pressable>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ color: textColor, fontSize: 18, fontWeight: "800" }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>

      {rightSlot ? <View>{rightSlot}</View> : null}
    </View>
  );
}

export function ApplicationPanel({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");

  return (
    <View
      style={[
        {
          borderRadius: APPLICATION_TOKENS.radius.card,
          backgroundColor: cardColor,
          paddingHorizontal: APPLICATION_TOKENS.spacing.cardX,
          paddingVertical: 16,
          ...APPLICATION_TOKENS.shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

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

export function ApplicationInput({
  label,
  required,
  multiline,
  leading,
  ...props
}: TextInputProps & {
  label: string;
  required?: boolean;
  multiline?: boolean;
  leading?: ReactNode;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const fieldColor = useThemeColor({ light: "rgb(246 246 244)", dark: "rgb(38 38 36)" }, "background");
  const placeholderColor = useThemeColor({ light: "#b4aca4", dark: "#8e8a83" }, "icon");

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>
        {label}
        {required ? <Text style={{ color: "#ff6f61" }}> *</Text> : null}
      </Text>

      <View
        style={{
          minHeight: multiline ? 108 : 48,
          borderRadius: APPLICATION_TOKENS.radius.field,
          backgroundColor: fieldColor,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
        }}
      >
        {leading ? <View style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }}>{leading}</View> : null}
        <TextInput
          placeholderTextColor={placeholderColor}
          style={{
            flex: 1,
            color: textColor,
            fontSize: 13,
            textAlignVertical: multiline ? "top" : "center",
            minHeight: multiline ? 80 : 48,
          }}
          multiline={multiline}
          {...props}
        />
      </View>
    </View>
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

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  const primaryColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={{
        height: 50,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: disabled ? "rgba(170,170,170,0.22)" : primaryColor,
      }}
    >
      <Text style={{ color: disabled ? mutedColor : "white", fontSize: 14, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor,
        backgroundColor: "transparent",
      }}
    >
      <Text style={{ color: textColor, fontSize: 14, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
