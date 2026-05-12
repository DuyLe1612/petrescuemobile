import React from "react";
import { Text, View } from "react-native";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error";

type Props = {
  label: string;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, { bg: string; text: string }> = {
  default: {
    bg: "bg-muted/40",
    text: "text-muted-foreground",
  },
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
  },
  success: {
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
  },
  warning: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    bg: "bg-destructive/10",
    text: "text-destructive",
  },
};

export const Badge: React.FC<Props> = ({
  label,
  variant = "default",
  className = "",
}) => {
  const styles = variantClasses[variant] || variantClasses.default;

  return (
    <View
      className={`rounded-full px-2.5 py-0.5 flex-row items-center justify-center ${styles.bg} ${className}`}
    >
      <Text className={`text-[10px] font-bold uppercase tracking-wider ${styles.text}`}>
        {label}
      </Text>
    </View>
  );
};

export default Badge;
