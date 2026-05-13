import { Text, TouchableOpacity, View } from "react-native";

import { PetFilterStatus } from "@/src/domain/entities/adoption-pet";

const CHIP_OPTIONS: Array<{ key: PetFilterStatus; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "vaccinated", label: "Đã tiêm phòng" },
  { key: "adult", label: "Trưởng thành" },
];

export const FilterChips = ({
  selectedStatus,
  onSelect,
}: {
  selectedStatus: PetFilterStatus;
  onSelect: (status: PetFilterStatus) => void;
}) => {
  return (
    <View className="flex-row gap-2">
      {CHIP_OPTIONS.map((chip) => {
        const isActive = chip.key === selectedStatus;

        return (
          <TouchableOpacity
            key={chip.key}
            onPress={() => onSelect(chip.key)}
            accessibilityRole="button"
            accessibilityLabel={`Lọc trạng thái ${chip.label}`}
            className={`rounded-full border px-4 py-2 ${
              isActive
                ? "border-primary bg-primary"
                : "border-border bg-card"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isActive ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
