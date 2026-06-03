import React from "react";
import { Text, View } from "react-native";

type Props = React.PropsWithChildren<{
  label?: string;
  required?: boolean;
  error?: string | null;
  className?: string;
}>;

export const FormField: React.FC<Props> = ({
  label,
  required = false,
  error,
  className = "",
  children,
}) => {
  return (
    <View className={`w-full mb-4 ${className}`}>
      {label ? (
        <Text className="mb-2 text-xs font-semibold text-muted-foreground">
          {label}
          {required ? <Text className="text-destructive font-bold"> *</Text> : null}
        </Text>
      ) : null}

      {children}

      {error ? (
        <Text className="mt-2 text-xs font-medium text-destructive leading-4">
          {error}
        </Text>
      ) : null}
    </View>
  );
};

export default FormField;
