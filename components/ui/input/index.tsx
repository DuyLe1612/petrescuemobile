import React from "react";
import { TextInput as RNTextInput, Text, View } from "react-native";

type Props = React.ComponentProps<typeof RNTextInput> & {
  label?: string;
  error?: string | null;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export const Input: React.FC<Props> = ({
  label,
  error,
  left,
  right,
  style,
  ...rest
}) => {
  return (
    <View className="w-full">
      {label ? (
        <Text className="mb-2 text-xs font-semibold text-muted-foreground">
          {label}
        </Text>
      ) : null}

      <View className="flex-row items-center rounded-xl border border-border bg-input px-3 py-2">
        {left ? <View className="mr-2">{left}</View> : null}
        <RNTextInput
          {...rest}
          style={[]}
          className="flex-1 p-0 m-0 text-foreground"
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
        {right ? <View className="ml-2">{right}</View> : null}
      </View>

      {error ? (
        <Text className="mt-2 text-sm text-destructive">{error}</Text>
      ) : null}
    </View>
  );
};

export default Input;
