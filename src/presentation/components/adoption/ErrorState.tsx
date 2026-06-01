import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export const ErrorState = ({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) => {
  return (
    <View className="mx-4 items-center rounded-[28px] border border-border bg-card px-6 py-10">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-rose-50">
        <Feather name="alert-triangle" size={24} color="#dc2626" />
      </View>
      <Text className="mt-4 text-center text-base font-bold text-foreground">{message}</Text>
      <TouchableOpacity
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Thử tải lại danh sách thú cưng"
        className="mt-5 rounded-full border border-primary px-5 py-3"
      >
        <Text className="text-sm font-bold text-primary">Thử lại</Text>
      </TouchableOpacity>
    </View>
  );
};
