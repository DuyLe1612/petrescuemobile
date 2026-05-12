import React from "react";
import { Modal as RNModal, Pressable, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = React.PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}>;

export const Modal: React.FC<Props> = ({
  visible,
  onClose,
  title,
  className = "",
  children,
}) => {
  return (
    <RNModal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="max-h-[90%] rounded-t-[30px] bg-card border-t border-border"
        >
          <View className={`px-4 pt-3 pb-6 ${className}`}>
            {/* Grab handle/indicator for bottom sheets */}
            <View className="items-center pb-3">
              <View className="h-1.5 w-12 rounded-full bg-muted" />
            </View>

            {title ? (
              <View className="flex-row items-center justify-between mb-4 pb-2 border-b border-border/30">
                <Text className="text-lg font-black text-foreground">
                  {title}
                </Text>
                <Pressable
                  onPress={onClose}
                  className="h-8 w-8 items-center justify-center rounded-full bg-muted/60 active:bg-muted"
                  accessibilityRole="button"
                  accessibilityLabel="Đóng"
                >
                  <Ionicons name="close" size={18} className="text-muted-foreground" />
                </Pressable>
              </View>
            ) : null}

            {children}
          </View>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
};

export default Modal;
