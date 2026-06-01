import { Feather } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";

export const SearchBar = ({
  value,
  onChangeText,
  onClear,
}: {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}) => {
  return (
    <View className="flex-row items-center rounded-2xl border border-border bg-card px-4 py-3">
      <Feather name="search" size={18} color="#7a6f67" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Tìm theo tên, giống hoặc khu vực"
        placeholderTextColor="#9a8f87"
        className="mx-3 flex-1 text-[15px] text-foreground"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType="search"
        accessibilityLabel="Ô tìm kiếm thú cưng"
      />
      {value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          accessibilityRole="button"
          accessibilityLabel="Xóa từ khóa tìm kiếm"
          className="h-8 w-8 items-center justify-center rounded-full bg-muted"
        >
          <Feather name="x" size={16} color="#7a6f67" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
