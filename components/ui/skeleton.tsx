import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

type Props = {
  width?: number | string;
  height?: number | string;
  variant?: "rectangle" | "circle" | "rounded";
  className?: string;
};

export const Skeleton: React.FC<Props> = ({
  width = "100%",
  height = 20,
  variant = "rounded",
  className = "",
}) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.8,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0.3,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();
  }, [pulseAnim]);

  const borderRadius =
    variant === "circle" ? 9999 : variant === "rounded" ? 12 : 0;

  return (
    <Animated.View
      style={{
        width: typeof width === "number" ? width : undefined,
        height: typeof height === "number" ? height : undefined,
        opacity: pulseAnim,
        borderRadius,
      }}
      className={`bg-muted/60 dark:bg-muted/30 ${
        typeof width === "string" ? `w-${width}` : ""
      } ${typeof height === "string" ? `h-${height}` : ""} ${className}`}
    />
  );
};

export default Skeleton;
