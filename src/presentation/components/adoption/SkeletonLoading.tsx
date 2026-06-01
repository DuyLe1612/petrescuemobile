import { View } from "react-native";

import { PET_CARD_HEIGHT } from "./PetListItem";

export const SkeletonLoading = ({
  cardWidth,
  count = 4,
}: {
  cardWidth: number;
  count?: number;
}) => {
  return (
    <View className="px-4 pb-28">
      <View className="flex-row flex-wrap justify-between">
        {Array.from({ length: count }).map((_, index) => (
          <View
            key={index}
            className="mb-4 overflow-hidden rounded-[28px] border border-border bg-card"
            style={{ width: cardWidth, height: PET_CARD_HEIGHT }}
          >
            <View className="h-44 bg-muted" />
            <View className="p-4">
              <View className="h-5 w-28 rounded-full bg-muted" />
              <View className="mt-3 h-4 w-20 rounded-full bg-muted" />
              <View className="mt-5 h-9 rounded-2xl bg-muted" />
              <View className="mt-5 h-4 w-full rounded-full bg-muted" />
              <View className="mt-2 h-4 w-2/3 rounded-full bg-muted" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
