import React from "react";
import { View } from "react-native";

type Props = React.PropsWithChildren<{ className?: string }>;

export const Card: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <View
      className={`rounded-xl bg-card border border-border p-4 ${className}`}
    >
      {children}
    </View>
  );
};

export default Card;
