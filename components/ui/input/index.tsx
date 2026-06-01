import React from "react";
import { TextInput as RNTextInput, View } from "react-native";

type Props = React.ComponentProps<typeof RNTextInput> & {
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerClassName?: string;
};

export const Input = React.forwardRef<RNTextInput, Props>(
  ({ left, right, containerClassName = "", style, ...rest }, ref) => {
    return (
      <View
        className={`flex-row items-center rounded-xl border border-border bg-muted/20 px-3 py-3 focus-within:border-primary focus-within:bg-transparent ${containerClassName}`}
      >
        {left ? <View className="mr-2">{left}</View> : null}
        <RNTextInput
          ref={ref}
          {...rest}
          style={[]}
          className="flex-1 p-0 m-0 text-sm text-foreground"
          placeholderTextColor="rgba(125, 125, 125, 0.5)"
        />
        {right ? <View className="ml-2">{right}</View> : null}
      </View>
    );
  }
);

export default Input;
