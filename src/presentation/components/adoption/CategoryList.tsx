import { Text, TouchableOpacity, View } from "react-native";

import { PetSpecies } from "@/src/domain/entities/adoption-pet";

const CATEGORIES: { key: PetSpecies; label: string; icon: string }[] = [
  { key: "all", label: "Tất cả", icon: "🐾" },
  { key: "dog", label: "Chó", icon: "🐶" },
  { key: "cat", label: "Mèo", icon: "🐱" },
  { key: "bird", label: "Chim", icon: "🐦" },
  { key: "rabbit", label: "Thỏ", icon: "🐰" },
];

export const CategoryList = ({
  selectedSpecies,
  onSelect,
}: {
  selectedSpecies: PetSpecies;
  onSelect: (species: PetSpecies) => void;
}) => {
  return (
    <View className="flex-row gap-3">
      {CATEGORIES.map((category) => {
        const isActive = category.key === selectedSpecies;

        return (
          <TouchableOpacity
            key={category.key}
            onPress={() => onSelect(category.key)}
            accessibilityRole="button"
            accessibilityLabel={`Lọc theo ${category.label}`}
            className="items-center"
          >
            <View
              className={`h-16 w-16 items-center justify-center rounded-full border ${
                isActive
                  ? "border-primary bg-primary"
                  : "border-border bg-card"
              }`}
            >
              <Text className="text-2xl">{category.icon}</Text>
            </View>
            <Text
              className={`mt-2 text-xs font-semibold ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
