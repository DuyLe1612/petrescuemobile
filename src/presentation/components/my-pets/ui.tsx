import { Feather } from "@expo/vector-icons";
import { useThemeColor } from "@/src/presentation/hooks/use-theme-color";
import { type ComponentProps, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export const MY_PET_TOKENS = {
  spacing: {
    screenX: 16,
    top: 58,
    section: 18,
    blockGap: 14,
  },
  radius: {
    card: 22,
    pill: 999,
    input: 16,
    image: 18,
  },
  shadow: {
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} as const;

export function MyPetTopBar({
  title,
  onBack,
  rightSlot,
  backIcon = "chevron-left",
}: {
  title: string;
  onBack: () => void;
  rightSlot?: ReactNode;
  backIcon?: "chevron-left" | "x";
}) {
  const textColor = useThemeColor({}, "text");

  return (
    <View
      style={{
        minHeight: 54,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        style={{ width: 34, height: 34, alignItems: "center", justifyContent: "center" }}
      >
        <Feather name={backIcon} size={20} color={textColor} />
      </Pressable>
      <Text style={{ color: textColor, fontSize: 20, fontWeight: "800" }}>{title}</Text>
      <View style={{ minWidth: 34, alignItems: "flex-end" }}>{rightSlot}</View>
    </View>
  );
}

export function MyPetPanel({
  children,
  style,
}: {
  children: ReactNode;
  style?: ComponentProps<typeof View>["style"];
}) {
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");

  return (
    <View
      style={[
        {
          borderRadius: MY_PET_TOKENS.radius.card,
          backgroundColor: cardColor,
          paddingHorizontal: 14,
          paddingVertical: 14,
          ...MY_PET_TOKENS.shadow,
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
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 0.8,
        marginBottom: 8,
      }}
    >
      {label}
    </Text>
  );
}

export function StatCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 18,
        backgroundColor: "rgba(39,127,143,0.10)",
        paddingVertical: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: accent, fontSize: 18, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: "#5f6b76", fontSize: 11, marginTop: 3 }}>{label}</Text>
    </View>
  );
}

export function ToneChip({
  label,
  tone,
  compact = false,
}: {
  label: string;
  tone: "good" | "warning" | "alert";
  compact?: boolean;
}) {
  const toneMap = {
    good: { backgroundColor: "rgba(95,185,92,0.14)", color: "#44b882" },
    warning: { backgroundColor: "rgba(255,159,67,0.16)", color: "#ff9f43" },
    alert: { backgroundColor: "rgba(255,111,97,0.14)", color: "#ff6f61" },
  } as const;

  return (
    <View
      style={{
        borderRadius: MY_PET_TOKENS.radius.pill,
        backgroundColor: toneMap[tone].backgroundColor,
        paddingHorizontal: compact ? 8 : 10,
        paddingVertical: compact ? 4 : 5,
      }}
    >
      <Text style={{ color: toneMap[tone].color, fontSize: compact ? 10 : 11, fontWeight: "700" }}>
        {label}
      </Text>
    </View>
  );
}

export function SelectChip({
  label,
  selected,
  activeColor,
  onPress,
}: {
  label: string;
  selected: boolean;
  activeColor: string;
  onPress?: () => void;
}) {
  const textColor = useThemeColor({}, "text");

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: MY_PET_TOKENS.radius.pill,
        backgroundColor: selected ? activeColor : "rgba(39,127,143,0.10)",
        paddingHorizontal: 12,
        paddingVertical: 9,
      }}
    >
      <Text style={{ color: selected ? "#ffffff" : textColor, fontSize: 12, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function LabeledInput({
  label,
  required = false,
  helper,
  multiline = false,
  ...props
}: ComponentProps<typeof TextInput> & {
  label: string;
  required?: boolean;
  helper?: string;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardColor = useThemeColor({ light: "#ffffff", dark: "#232321" }, "background");
  const borderColor = useThemeColor({ light: "rgb(233 230 227)", dark: "rgb(58 58 58)" }, "icon");

  return (
    <View style={{ marginTop: 12 }}>
      <Text style={{ color: textColor, fontSize: 12, fontWeight: "700", marginBottom: 8 }}>
        {label}
        {required ? <Text style={{ color: "#ff6f61" }}> *</Text> : null}
      </Text>
      <View
        style={{
          minHeight: multiline ? 108 : 46,
          borderRadius: MY_PET_TOKENS.radius.input,
          backgroundColor: cardColor,
          borderWidth: 1,
          borderColor,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
          justifyContent: multiline ? "flex-start" : "center",
        }}
      >
        <TextInput
          {...props}
          multiline={multiline}
          placeholderTextColor={mutedColor}
          textAlignVertical={multiline ? "top" : "center"}
          style={{
            color: textColor,
            fontSize: 14,
            paddingVertical: 0,
            minHeight: multiline ? 82 : undefined,
          }}
        />
      </View>
      {helper ? (
        <Text style={{ color: mutedColor, fontSize: 11, marginTop: 6 }}>{helper}</Text>
      ) : null}
    </View>
  );
}

export function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: string;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
      }}
    >
      <Text style={{ color: mutedColor, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: highlight ?? textColor, fontSize: 13, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

export function ChecklistRow({
  title,
  detail,
  tone,
  onPress,
}: {
  title: string;
  detail: string;
  tone: "good" | "warning" | "alert";
  onPress?: () => void;
}) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <Pressable
      onPress={onPress}
      style={{
        minHeight: 58,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: MY_PET_TOKENS.radius.pill,
          borderWidth: 1,
          borderColor: tone === "good" ? "#44b882" : tone === "warning" ? "#ff9f43" : "#ff6f61",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: MY_PET_TOKENS.radius.pill,
            backgroundColor: tone === "good" ? "#44b882" : tone === "warning" ? "#ff9f43" : "#ff6f61",
          }}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: textColor, fontSize: 13, fontWeight: "700" }}>{title}</Text>
        <Text style={{ color: mutedColor, fontSize: 11, marginTop: 3 }}>{detail}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={mutedColor} />
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  const primaryColor = useThemeColor({}, "tint");

  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 46,
        borderRadius: MY_PET_TOKENS.radius.pill,
        backgroundColor: primaryColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 14, fontWeight: "800" }}>{label}</Text>
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
        height: 46,
        borderRadius: MY_PET_TOKENS.radius.pill,
        borderWidth: 1,
        borderColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: textColor, fontSize: 14, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
