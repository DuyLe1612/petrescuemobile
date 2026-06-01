import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export const EmptyState = ({
  onClearFilters,
}: {
  onClearFilters: () => void;
}) => {
  return (
    <View className="mx-4 items-center rounded-[28px] border border-dashed border-border bg-card px-6 py-10">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Text className="text-4xl">🐾</Text>
      </View>
      <Text className="mt-5 text-lg font-extrabold text-foreground">
        Không tìm thấy bé phù hợp
      </Text>
      <Text className="mt-2 text-center text-sm leading-6 text-muted-foreground">
        Thử đổi loài, trạng thái hoặc xoá từ khoá để xem thêm thú cưng đang chờ nhận nuôi.
      </Text>
      <TouchableOpacity
        onPress={onClearFilters}
        accessibilityRole="button"
        accessibilityLabel="Xóa toàn bộ bộ lọc"
        className="mt-5 flex-row items-center gap-2 rounded-full bg-primary px-5 py-3"
      >
        <Feather name="rotate-ccw" size={16} color="#f6fcfc" />
        <Text className="text-sm font-bold text-primary-foreground">Xóa bộ lọc</Text>
      </TouchableOpacity>
    </View>
  );
};
