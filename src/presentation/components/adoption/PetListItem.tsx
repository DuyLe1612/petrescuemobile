import { Feather, Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Text, View } from "react-native";

import { AdoptionPet } from "@/src/domain/entities/adoption-pet";

import { FastImage } from "./FastImage";

export const PET_CARD_HEIGHT = 312;

const genderIconName: Record<AdoptionPet["gender"], "male" | "female"> = {
  male: "male",
  female: "female",
};

const genderLabel: Record<AdoptionPet["gender"], string> = {
  male: "Đực",
  female: "Cái",
};

const RawPetListItem = ({
  pet,
  width,
}: {
  pet: AdoptionPet;
  width: number;
}) => {
  return (
    <View
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Thú cưng ${pet.name}, ${pet.breed}, ${pet.ageLabel}, ${pet.location}`}
      className="overflow-hidden rounded-[28px] border border-border bg-card"
      style={{ width, height: PET_CARD_HEIGHT }}
    >
      <View className="relative">
        <FastImage source={{ uri: pet.imageUrl }} style={{ width: "100%", height: 176 }} />
        <View className="absolute left-3 top-3 rounded-full bg-black/65 px-3 py-1.5">
          <Text className="text-[11px] font-semibold text-white">{pet.badge}</Text>
        </View>
      </View>

      <View className="flex-1 justify-between p-4">
        <View>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-foreground" numberOfLines={1}>
                {pet.name}
              </Text>
              <Text className="mt-1 text-xs text-muted-foreground" numberOfLines={1}>
                {pet.breed}
              </Text>
            </View>
            <View className="rounded-full bg-muted px-3 py-1">
              <Text className="text-[11px] font-semibold text-foreground">
                {pet.species === "dog"
                  ? "Chó"
                  : pet.species === "cat"
                  ? "Mèo"
                  : pet.species === "bird"
                  ? "Chim"
                  : "Thỏ"}
              </Text>
            </View>
          </View>

          <View className="mt-4 flex-row flex-wrap gap-2">
            <View className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-1.5">
              <Feather name="clock" size={13} color="#7a6f67" />
              <Text className="text-xs text-foreground">{pet.ageLabel}</Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-muted px-3 py-1.5">
              <Ionicons name={genderIconName[pet.gender]} size={13} color="#7a6f67" />
              <Text className="text-xs text-foreground">{genderLabel[pet.gender]}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-xs leading-5 text-muted-foreground" numberOfLines={2}>
            {pet.description}
          </Text>
          <View className="mt-3 flex-row items-center gap-2">
            <Feather name="map-pin" size={14} color="#277f8f" />
            <Text className="flex-1 text-xs font-semibold text-primary" numberOfLines={1}>
              {pet.location}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const PetListItem = memo(RawPetListItem);
